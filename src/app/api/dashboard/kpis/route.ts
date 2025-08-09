import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { globalCache } from '@/lib/cache';
import { KPIParams, KPIResponse, KPIAccess, KPICustomer } from '~/types/kpi';
import { PrismaTransaction } from '~/types/prisma';

export const maxDuration = 30; // Aumenta o timeout para 30 segundos
export const dynamic = 'force-dynamic'; // Sempre executa a rota

// Função auxiliar para processar dados do gráfico
function processChartData(data: Array<{ createdAt: string; _count: number }>) {
  // Ordena por hora para garantir sequência correta
  const sorted = [...data].sort((a, b) => {
    const hourA = parseInt(a.createdAt.split(':')[0]);
    const hourB = parseInt(b.createdAt.split(':')[0]);
    return hourA - hourB;
  });

  const labels = sorted.map(hp => `${hp.createdAt}h`);
  const series = sorted.map(hp => hp._count);

  return { labels, series };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const timeRange = searchParams.get('timeRange') || '24h';
    
    // Chave de cache baseada nos parâmetros
    const cacheKey = `kpis:${storeId || 'all'}:${timeRange}`;
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

  // Define o intervalo de tempo
  const now = new Date();
  let startDate = new Date();
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default: // 24h
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  // Base where clause
  const whereClause = storeId ? { 
    storeId: isNaN(parseInt(storeId)) ? undefined : parseInt(storeId) 
  } : {};

  // Realiza todas as queries em paralelo com Promise.all
  const [basicStats, accessesByCustomer, accessStats] = await Promise.all([
    // Query 1: Estatísticas básicas usando prisma.$transaction
    prisma.$transaction(async (tx) => {
      const [stores, customers, devices, accesses] = await Promise.all([
        tx.store.count(),
        tx.customer.count(storeId ? { where: whereClause } : undefined),
        tx.device.count(storeId ? { where: whereClause } : undefined),
        tx.faceAccess.count({
          where: {
            ...whereClause,
            createdAt: { gte: startDate }
          }
        })
      ]);
      return { stores, customers, devices, accesses };
    }),

    // Query 2: Top clientes com seus detalhes
    prisma.faceAccess.groupBy({
      by: ['customerId'],
      where: {
        ...whereClause,
        createdAt: { gte: startDate },
        customerId: { not: undefined }
      },
      _count: { customerId: true },
      orderBy: { _count: { customerId: 'desc' } },
      take: 5,
    }),

    // Query 3: Estatísticas de acesso (média de confiança e acessos por hora)
    prisma.$transaction(async (tx) => {
      const [confidence, hourlyAccess] = await Promise.all([
        tx.faceAccess.aggregate({
          where: {
            ...whereClause,
            createdAt: { gte: startDate }
          },
          _avg: { confidence: true }
        }),
        tx.faceAccess.findMany({
          where: {
            ...whereClause,
            createdAt: { gte: startDate }
          },
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      ]);

      // Processa os acessos por hora
      const hoursCount = new Map<number, number>();
      hourlyAccess.forEach(access => {
        const hour = new Date(access.createdAt).getHours();
        hoursCount.set(hour, (hoursCount.get(hour) || 0) + 1);
      });

      // Converte para array e ordena
      const horariosPico = Array.from(hoursCount.entries())
        .map(([hour, count]) => ({
          createdAt: `${hour}:00`,
          _count: count
        }))
        .sort((a, b) => b._count - a._count)
        .slice(0, 5);

      return {
        avgConfianca: confidence._avg.confidence,
        horariosPico
      };
    })
  ]);

  // Top Clientes with detailed customer information
  const topClientes = await prisma.$transaction(async (tx) => {
    // Primeiro, encontramos os clientes com mais acessos
    const accessCounts = await tx.faceAccess.groupBy({
      by: ['customerId'],
      where: {
        ...whereClause,
        createdAt: { gte: startDate },
        customerId: { not: undefined }
      },
      _count: { customerId: true },
      orderBy: { _count: { customerId: 'desc' } },
      take: 5
    });

    // Depois, buscamos os detalhes desses clientes
    const clientesDetails = await Promise.all(
      accessCounts.map(async (access) => {
        const customer = await tx.customer.findUnique({
          where: { id: access.customerId },
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        });

        return {
          customerId: access.customerId,
          name: customer?.name || `Cliente ${access.customerId}`,
          imageUrl: customer?.imageUrl,
          accessCount: access._count?.customerId || 0
        };
      })
    );

    return clientesDetails;
  });

  // Fetch complete customer details including name and photo
  const topClientesDetails = await Promise.all(
    topClientes.map(async (cliente) => {
      if (!cliente.customerId) return null;
      
      const customer = await prisma.customer.findUnique({
        where: { 
          id: cliente.customerId,
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        }
      });

      return {
        customerId: cliente.customerId,
        name: customer?.name || `Cliente ${cliente.customerId}`,
        imageUrl: customer?.imageUrl || null,
        accessCount: cliente.accessCount
      };
    })
  ).then(results => results.filter((result): result is NonNullable<typeof result> => result !== null));

  // Média de confiança
  const avgConfianca = await prisma.faceAccess.aggregate({
    where: {
      ...whereClause,
      createdAt: { gte: startDate }
    },
    _avg: { confidence: true }
  });

  // Horários de pico
  const acessosPorHora = await prisma.faceAccess.findMany({
    where: {
      ...whereClause,
      createdAt: { gte: startDate }
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const { stores: storeCount, customers, devices, accesses } = basicStats;

  // Processa os horários de pico dos acessos
  const horariosCount: Record<string, number> = {};
  acessosPorHora.forEach(acesso => {
    const hora = new Date(acesso.createdAt).getHours();
    horariosCount[hora] = (horariosCount[hora] || 0) + 1;
  });

  // Processa os horários de pico
  const horariosPico = Object.entries(horariosCount)
    .map(([hora, count]) => ({
      hora: parseInt(hora),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(({ hora, count }) => ({
      createdAt: new Date(now.setHours(hora, 0, 0, 0)).toISOString(),
      _count: count
    }));

  // Processa os dados do gráfico
  const chartData = processChartData(horariosPico);

  // Prepara os KPIs
  const kpis = [
    { label: 'Lojas', value: storeCount, icon: 'Store', color: 'bg-blue-500' },
    { label: 'Clientes', value: customers, icon: 'UserCircle', color: 'bg-green-500' },
    { label: 'Dispositivos', value: devices, icon: 'Cpu', color: 'bg-purple-500' },
    { label: 'Acessos no Período', value: accesses, icon: 'Activity', color: 'bg-orange-500' }
  ];

  // Série temporal
  const interval = timeRange === '30d' ? 24 * 60 * 60 * 1000 : // 1 dia
                  timeRange === '7d' ? 6 * 60 * 60 * 1000 : // 6 horas
                  60 * 60 * 1000; // 1 hora
  const points = timeRange === '30d' ? 30 :
                timeRange === '7d' ? 28 :
                24;

  const timeLabels: string[] = [];
  const timeSeries: number[] = [];

  // Get temporal data
  for (let i = points - 1; i >= 0; i--) {
    const start = new Date(now.getTime() - i * interval);
    const end = new Date(start.getTime() + interval);
    const count = await prisma.faceAccess.count({
      where: {
        ...whereClause,
        createdAt: { gte: start, lt: end }
      }
    });

    if (timeRange === '30d') {
      timeLabels.push(start.toLocaleDateString('pt-BR'));
    } else {
      timeLabels.push(start.getHours().toString().padStart(2, '0') + ':00');
    }
    timeSeries.push(count);
  }

  // Get store names for selector
  const stores = await prisma.store.findMany({
    select: { id: true, name: true }
  });

  // Cache and return the final response
  const response = {
    kpis,
    topClientes: topClientes, // Agora usando os dados processados diretamente da transação
    avgConfianca: accessStats.avgConfianca,
    horariosPico,
    chartLabels: chartData.labels,
    chartSeries: chartData.series,
    timeLabels,
    timeSeries,
    stores
  };

  globalCache.set(cacheKey, response);
  return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar KPIs', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
