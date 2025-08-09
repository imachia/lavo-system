'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Line } from 'react-chartjs-2';
import Avatar from '@/components/ui/Avatar';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface Store { id: number; name: string; }
interface Access { id: number; storeId: number; deviceId: number; capturedImageUrl: string; createdAt: string; }

export default function TrafegoPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | ''>('');
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    fetchStores().catch(console.error);
  }, []);

  // Load accesses when store changes
  useEffect(() => {
    if (selectedStore) {
      fetchAccesses(Number(selectedStore)).catch(console.error);
    } else {
      fetchAccessesAll().catch(console.error);
    }
  }, [selectedStore]);

  const fetchStores = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch stores');
      }
      
      setStores(data.stores || []);
      if (data.stores?.length) {
        setSelectedStore(data.stores[0].id);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stores');
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccesses = async (storeId: number) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/access?storeId=${storeId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao buscar acessos');
      }
      
      const data = await res.json();
      setAccesses(data.accesses || []);
    } catch (error) {
      console.error('Error fetching accesses:', error);
      setError(error instanceof Error ? error.message : 'Falha ao buscar acessos');
      setAccesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccessesAll = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/access');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao buscar acessos');
      }
      
      const data = await res.json();
      setAccesses(data.accesses || []);
    } catch (error) {
      console.error('Error fetching all accesses:', error);
      setError(error instanceof Error ? error.message : 'Falha ao buscar acessos');
      setAccesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const chart = useMemo(() => {
    const buckets: Record<string, number> = {};
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const key = d.getHours().toString().padStart(2, '0') + ':00';
      buckets[key] = 0;
    }
    accesses.forEach((a) => {
      const d = new Date(a.createdAt);
      const key = d.getHours().toString().padStart(2, '0') + ':00';
      if (key in buckets) buckets[key] += 1;
    });
    const labels = Object.keys(buckets);
    const data = Object.values(buckets);
    return {
      labels,
      datasets: [
        {
          label: 'Acessos por hora',
          data,
          fill: true,
          tension: 0.35,
          backgroundColor: 'rgba(15,17,20,0.08)',
          borderColor: 'rgba(15,17,20,0.5)',
          borderWidth: 1.5,
          pointRadius: 0,
        },
      ],
    };
  }, [accesses]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { intersect: false, mode: 'index' as const } },
    scales: {
      x: {
        grid: { color: 'rgba(15,17,20,0.06)', drawBorder: false },
        ticks: { color: 'rgba(15,17,20,0.45)', maxRotation: 0, autoSkip: true },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(15,17,20,0.06)', drawBorder: false },
        ticks: { color: 'rgba(15,17,20,0.45)' },
        border: { display: false },
      },
    },
  } as const;

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-red-600">
          Error: {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tráfego</h1>
            <p className="text-sm text-gray-500">Acessos reconhecidos (últimas 24h)</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Loja:</span>
            <select value={selectedStore} onChange={(e) => setSelectedStore(Number(e.target.value))} className="input">
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <div className="card h-[560px] flex flex-col p-0 overflow-hidden">
              <div className="px-5 py-4 flex-none">
                <h3 className="text-sm font-semibold text-gray-700">Últimos acessos</h3>
              </div>
              <div className="px-5 py-4 space-y-4 flex-1 overflow-y-auto">
                {accesses.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Avatar src={a.capturedImageUrl} alt="Captura de pessoa" size="md" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">Acesso reconhecido</div>
                      <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                ))}
                {accesses.length === 0 && (
                  <div className="text-sm text-gray-500">Nenhum acesso nas últimas 24 horas.</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="card h-[560px] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Acessos por hora</h3>
              </div>
              <Line data={chart} options={options} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
