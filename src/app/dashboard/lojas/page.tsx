'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Store { id: number; name: string; address: string; createdAt: string; }

export default function LojasPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ name: '', address: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      setStores(data.stores || []);
    } finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: '', address: '' }); setIsOpen(true); };
  const openEdit = (store: Store) => { setEditing(store); setForm({ name: store.name, address: store.address }); setIsOpen(true); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/stores/${editing.id}` : '/api/stores';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setIsOpen(false); await fetchData();
  };

  const remove = async (id: number) => { await fetch(`/api/stores/${id}`, { method: 'DELETE' }); await fetchData(); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lojas</h1>
            <p className="text-sm text-gray-500">Gerencie suas lojas e endereços</p>
          </div>
          <Button onClick={openCreate} leftIcon={<Plus size={16} />}>Nova Loja</Button>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : (
            <div className="divide-y divide-transparent">
              <div className="bg-gray-50/50 rounded-xl px-6 py-3 mb-2 flex items-center">
                <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Nome</div>
                <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Endereço</div>
                <div className="flex-1 text-xs font-medium text-gray-600 uppercase">Criada em</div>
                <div className="w-32"></div>
              </div>
              
              <div className="space-y-2">
                {stores.map((s) => (
                  <div key={s.id} className="flex items-center px-6 py-3 hover:bg-orange-50/80 rounded-xl transition-colors">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>{s.name}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>{s.address}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-sm text-gray-600">{new Date(s.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-32 flex gap-2 justify-end">
                      <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Edit size={14} className="text-gray-500" />
                      </button>
                      <button onClick={() => remove(s.id)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Trash2 size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="card w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar Loja' : 'Nova Loja'}</h2>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nome</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Endereço</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full input" required />
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
