'use client';

import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip, Filler } from 'chart.js';
import { Store, UserCircle, Cpu, Activity, Users, Clock, Percent } from 'lucide-react';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

import type { KPI, DashboardData } from '@/types';

interface TopCliente {
  customerId: number;
  name: string;
  imageUrl: string | null;
  accessCount: number;
}

const iconMap = { Store, UserCircle, Cpu, Activity };

export default function DashboardPage() {
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [data, setData] = useState<DashboardData>({
    kpis: [],
    labels: [],
    series: [],
    stores: [],
    topClientes: [],
    horariosPico: [],
    avgConfianca: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/dashboard/kpis?storeId=${selectedStore === 'all' ? '' : selectedStore}&timeRange=${timeRange}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao carregar KPIs');
      }
      const response = await res.json();
      setData({
        ...response,
        kpis: response.kpis.map((k: KPI) => ({ 
          ...k, 
          icon: iconMap[k.icon as keyof typeof iconMap] || iconMap.Activity 
        }))
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza os dados quando mudam
  useEffect(() => {
    fetchKpis();
  }, [selectedStore, timeRange]);

  const chart = useMemo(() => ({
    labels: data.labels,
    datasets: [{
      label: 'Acessos por hora',
      data: data.series,
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(17,17,17,0.08)',
      borderColor: 'rgba(17,17,17,1)',
      pointRadius: 0,
    }],
  }), [data.labels, data.series]);

  const timeRangeOptions = [
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {isLoading && (
          <div className="w-full h-1 bg-gray-100 overflow-hidden">
            <div className="h-full bg-blue-500 animate-progress" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erro! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <Select
            label="Loja"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            options={[
              { value: 'all', label: 'Todas as Lojas' },
              ...data.stores.map(store => ({ 
                value: store.id.toString(), 
                label: store.name 
              }))
            ]}
            className="w-48"
          />
          <Select
            label="Período"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            className="w-48"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpis.map((k, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center">
                <div className={`p-3 rounded text-white ${k.color}`}>
                  {React.createElement(k.icon as any, { size: 18 })}
                </div>
                <div className="ml-3">
                  <div className="text-xs text-gray-500">{k.label}</div>
                  <div className="text-2xl font-semibold">{k.value}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Acessos por Hora</h3>
            </div>
            <div className="h-[300px]">
              <Line 
                data={chart} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false } 
                  }, 
                  scales: { 
                    y: { beginAtZero: true } 
                  } 
                }} 
              />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Clientes</h3>
            <div className="space-y-4">
              {data?.topClientes?.map((cliente) => (
                <div key={cliente.customerId} className="flex items-center gap-3">
                  <Avatar 
                    src={cliente.imageUrl || ''}
                    alt={cliente.name}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-medium">{cliente.name}</div>
                    <div className="text-xs text-gray-500">{cliente.accessCount || 0} acessos</div>
                  </div>
                </div>
              )) || null}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Horários de Pico</h3>
            <div className="space-y-3">
              {data.horariosPico?.map((horario) => {
                const hora = new Date(horario.createdAt).getHours();
                const horaFormatada = hora.toString().padStart(2, '0');
                const horaProxima = ((hora + 1) % 24).toString().padStart(2, '0');
                return (
                  <div key={horario.createdAt} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">{horaFormatada}:00 - {horaProxima}:00</span>
                    </div>
                    <div className="text-sm font-medium">{horario._count} acessos</div>
                  </div>
                );
              }) ?? []}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Confiança Média</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-gray-400" />
                  <span className="text-sm">Média Geral</span>
                </div>
                <div className="text-sm font-medium">{(data.avgConfianca * 100).toFixed(1)}%</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
