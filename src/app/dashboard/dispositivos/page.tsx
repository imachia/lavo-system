'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Power } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Store { id: number; name: string; }
interface Device { id: number; storeId: number | null; label: string; doorName: string; serialNumber: string; status: 'ACTIVE' | 'INACTIVE'; }

export default function DispositivosPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | 'all'>('all');
  const [devices, setDevices] = useState<Device[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Device | null>(null);
  const [form, setForm] = useState({ label: '', doorName: '', serialNumber: '', storeId: '' });

  useEffect(() => { fetchStores(); }, []);
  useEffect(() => { fetchDevices(); }, [selectedStore]);

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Error fetching stores:', data.error, data.details);
        setStores([]);
        return;
      }
      
      setStores(data.stores || []);
      if (data.stores?.length) setSelectedStore(data.stores[0].id);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores([]);
    }
  };

  const fetchDevices = async () => {
    try {
      let url = '/api/devices';
      if (selectedStore !== 'all') url += `?storeId=${selectedStore}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Error fetching devices:', data.error, data.details);
        setDevices([]);
        return;
      }
      
      setDevices(data.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
    }
  };

  const kpis = useMemo(() => {
    const total = devices.length;
    const ativos = devices.filter(d => d.status === 'ACTIVE').length;
    const livres = devices.filter(d => d.storeId == null).length;
    return { total, ativos, livres };
  }, [devices]);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ label: '', doorName: '', serialNumber: '', storeId: selectedStore === 'all' ? '' : String(selectedStore) }); 
    setIsOpen(true); 
  };
  
  const openEdit = (d: Device) => { 
    setEditing(d); 
    setForm({ 
      label: d.label, 
      doorName: d.doorName, 
      serialNumber: d.serialNumber,
      storeId: d.storeId ? String(d.storeId) : ''
    }); 
    setIsOpen(true); 
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/devices/${editing.id}` : '/api/devices';
    const body = { 
      label: form.label,
      doorName: form.doorName,
      serialNumber: form.serialNumber,
      storeId: form.storeId === '' ? null : Number(form.storeId)
    };
    console.log('Enviando dados:', body);
    
    try {
      const response = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      const result = await response.json();
      console.log('Resposta:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar dispositivo');
      }
      
      setIsOpen(false); 
      await fetchDevices();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dispositivo. Por favor, tente novamente.');
    }
  };

  const toggleStatus = async (d: Device) => {
    const next = d.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await fetch(`/api/devices/${d.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    await fetchDevices();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dispositivos</h1>
            <p className="text-sm text-gray-500">Gerencie seus dispositivos e status</p>
          </div>
          <Button onClick={openCreate} leftIcon={<Plus size={16} />}>
            Novo Dispositivo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4"><div className="text-xs text-gray-500">Total</div><div className="text-xl font-semibold">{kpis.total}</div></div>
          <div className="card p-4"><div className="text-xs text-gray-500">Ativos</div><div className="text-xl font-semibold">{kpis.ativos}</div></div>
          <div className="card p-4"><div className="text-xs text-gray-500">Livres</div><div className="text-xl font-semibold">{kpis.livres}</div></div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Filtro de Loja:</span>
          <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="input">
            <option value="all">Todas</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="divide-y divide-transparent">
            <div className="bg-gray-50/50 rounded-xl px-6 py-3 mb-2 flex items-center">
              <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Rótulo</div>
              <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Porta</div>
              <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Serial</div>
              <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Loja</div>
              <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Status</div>
              <div className="w-32"></div>
            </div>
              
            <div className="space-y-2">
              {devices.map((d) => (
                <div key={d.id} className="flex items-center px-6 py-3 hover:bg-orange-50/80 rounded-xl transition-colors">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span>{d.label}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span>{d.doorName}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <span>{d.serialNumber}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span>{d.storeId ? stores.find(s => s.id === d.storeId)?.name : '-'}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-sm">{d.status}</span>
                  </div>
                  <div className="w-32 flex gap-2 justify-end">
                    <button onClick={() => openEdit(d)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <Edit size={14} className="text-gray-500" />
                    </button>
                    <button onClick={() => toggleStatus(d)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <Power size={14} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="card w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar Dispositivo' : 'Novo Dispositivo'}</h2>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Rótulo</label>
                  <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Porta</label>
                  <input value={form.doorName} onChange={(e) => setForm({ ...form, doorName: e.target.value })} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Serial</label>
                  <input value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Loja</label>
                  <select 
                    value={form.storeId} 
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })} 
                    className="w-full input"
                  >
                    <option value="">Sem vínculo</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
