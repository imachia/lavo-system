'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle2, Link2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Store { id: number; name: string; }
interface Device { id: number; label: string; doorName: string; serialNumber: string; }

export default function VinculacaoPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [storeId, setStoreId] = useState<number | ''>('');
  const [deviceId, setDeviceId] = useState<number | ''>('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStores(); fetchFreeDevices(); }, []);

  const fetchStores = async () => {
    try {
      console.log('Iniciando busca de lojas...');
      const res = await fetch('/api/stores');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao buscar lojas');
      }
      
      console.log('Lojas recebidas:', data.stores);
      setStores(data.stores || []);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      setStores([]);
    }
  };

  const fetchFreeDevices = async () => {
    const res = await fetch('/api/devices?free=true');
    const data = await res.json();
    setDevices(data.devices || []);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null); if (!storeId || !deviceId) return; setLoading(true);
    try {
      const selected = devices.find((d) => d.id === Number(deviceId));
      const res = await fetch('/api/technician/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serialNumber: selected?.serialNumber, storeId }) });
      const data = await res.json();
      if (res.ok) { setStatus('Vinculado com sucesso'); setDeviceId(''); await fetchFreeDevices(); } else { setStatus(data.error || 'Falha na vinculação'); }
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Vincular Dispositivo</h1>
        </div>
        <form onSubmit={submit} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm mb-1">Loja</label>
            <select value={storeId} onChange={(e) => setStoreId(Number(e.target.value))} className="w-full input" required>
              <option value="" disabled>Selecione</option>
              {stores.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Dispositivo (não vinculado)</label>
            <select value={deviceId} onChange={(e) => setDeviceId(Number(e.target.value))} className="w-full input" required>
              <option value="" disabled>Selecione</option>
              {devices.map((d) => (<option key={d.id} value={d.id}>{d.label} • {d.doorName} • {d.serialNumber}</option>))}
            </select>
          </div>
          <Button type="submit" leftIcon={<Link2 size={16} />} disabled={loading}>{loading ? 'Vinculando...' : 'Vincular'}</Button>
        </form>
        {status && (<div className="flex items-center gap-2 text-green-600"><CheckCircle2 size={18} /> {status}</div>)}
      </div>
    </DashboardLayout>
  );
}
