import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { globalCache } from '@/lib/cache';

export const maxDuration = 30; // Aumenta o timeout para 30 segundos
export const dynamic = 'force-dynamic'; // Sempre executa a rota

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
    const whereClause = storeId ? { storeId: parseInt(storeId) } : {};

    // Realiza todas as queries em paralelo
    const [basicStats, topClientesResult, accessStats] = await Promise.all([
      // Query 1: Estatísticas básicas
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

      // Query 2: Top clientes
      prisma.faceAccess.findMany({
        where: {
          ...whereClause,
          createdAt: { gte: startDate },
          customerId: { not: null }
        },
        select: {
          customerId: true,
          createdAt: true,
          customer: {
            select: {
              name: true,
              imageUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 100 // Pega um número maior para poder agrupar
      }),

      // Query 3: Estatísticas de acesso
      prisma.faceAccess.aggregate({
        where: {
          ...whereClause,
          createdAt: { gte: startDate }
        },
        _avg: {
          confidence: true
        }
      })
    ]);

    // Processa top clientes
    const topClientesMap = new Map<number, { count: number; name: string; imageUrl: string }>();
    topClientesResult.forEach(access => {
      if (!access.customerId) return;
      
      const current = topClientesMap.get(access.customerId) || {
        count: 0,
        name: access.customer?.name || 'Cliente não identificado',
        imageUrl: access.customer?.imageUrl || ''
      };
      
      topClientesMap.set(access.customerId, {
        ...current,
        count: current.count + 1
      });
    });

    const topClientes = Array.from(topClientesMap.entries())
      .map(([customerId, data]) => ({
        customerId,
        name: data.name,
        imageUrl: data.imageUrl,
        _count: { customerId: data.count }
      }))
      .sort((a, b) => b._count.customerId - a._count.customerId)
      .slice(0, 5);

    // Processa horários de pico
    const hoursCount = new Map<number, number>();
    topClientesResult.forEach(access => {
      const hour = new Date(access.createdAt).getHours();
      hoursCount.set(hour, (hoursCount.get(hour) || 0) + 1);
    });

    const horariosPico = Array.from(hoursCount.entries())
      .map(([hour, count]) => ({
        createdAt: `${hour}:00`,
        _count: count
      }))
      .sort((a, b) => b._count - a._count)
      .slice(0, 5);

    const { stores, customers, devices, accesses } = basicStats;

    // Prepara os KPIs
    const kpis = [
      { label: 'Lojas', value: stores, icon: 'Store', color: 'bg-blue-500' },
      { label: 'Clientes', value: customers, icon: 'UserCircle', color: 'bg-green-500' },
      { label: 'Dispositivos', value: devices, icon: 'Cpu', color: 'bg-purple-500' },
      { label: 'Acessos no Período', value: accesses, icon: 'Activity', color: 'bg-orange-500' }
    ];

    // Prepara dados do gráfico
    const chartData = processChartData(horariosPico);

    const responseData = {
      kpis,
      topClientes,
      avgConfianca: accessStats._avg.confidence || 0,
      horariosPico,
      labels: chartData.labels,
      series: chartData.series
    };

    // Salva no cache
    globalCache.set(cacheKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar KPIs', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

function processChartData(horariosPico: Array<{ createdAt: string; _count: number }>) {
  // Ordena por hora para garantir sequência correta
  const sorted = [...horariosPico].sort((a, b) => {
    const hourA = parseInt(a.createdAt.split(':')[0]);
    const hourB = parseInt(b.createdAt.split(':')[0]);
    return hourA - hourB;
  });

  const labels = sorted.map(hp => `${hp.createdAt}h`);
  const series = sorted.map(hp => hp._count);

  return { labels, series };
}
