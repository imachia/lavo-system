'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

interface Store { id: number; name: string; }
interface Customer { 
  id: number; 
  name: string; 
  email?: string; 
  phone?: string; 
  imageUrl: string; 
  createdAt: string;
  status: 'NEW' | 'ACTIVE' | 'VIP' | 'WARNING' | 'BLOCKED';
}

export default function ClientesPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', imageUrl: '', status: 'NEW' as Customer['status'] });

  useEffect(() => { fetchStores(); }, []);
  useEffect(() => { if (selectedStore) fetchCustomers(selectedStore); }, [selectedStore]);

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

  const fetchCustomers = async (storeId: number) => {
    try {
      const res = await fetch(`/api/customers?storeId=${storeId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setCustomers([]);
    }
  };

  const openCreate = () => { 
    setEditing(null); 
    setForm({ name: '', email: '', phone: '', imageUrl: '', status: 'NEW' }); 
    setIsOpen(true); 
  };

  const openEdit = (c: Customer) => { 
    setEditing(c); 
    setForm({ 
      name: c.name, 
      email: c.email || '', 
      phone: c.phone || '', 
      imageUrl: c.imageUrl,
      status: c.status
    }); 
    setIsOpen(true); 
  };

  const deleteCustomer = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (selectedStore) await fetchCustomers(selectedStore);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedStore) return;
      
      // Prepare the data based on whether we're editing or creating
      const baseData = {
        name: form.name,
        ...(form.email !== undefined && { email: form.email || null }),
        ...(form.phone !== undefined && { phone: form.phone || null }),
        imageUrl: form.imageUrl,
        ...(form.status && { status: form.status }),
        ...(selectedStore && { storeId: selectedStore })
      };
      
      const data = editing ? baseData : { ...baseData, storeId: selectedStore };

      if (!editing) {
        data.storeId = selectedStore;
      }

      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/customers/${editing.id}` : '/api/customers';
      
      const response = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        alert(errorData.error || 'Erro ao salvar cliente');
        return;
      }

      const result = await response.json();
      console.log('Cliente salvo com sucesso:', result);

      setIsOpen(false);
      setForm({ name: '', email: '', phone: '', imageUrl: '', status: 'NEW' });
      setEditing(null);
      
      if (selectedStore) {
        await fetchCustomers(selectedStore);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Por favor, tente novamente.');
      alert('Erro ao salvar cliente');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-sm text-gray-500">Gerencie clientes e imagens</p>
          </div>
          <Button onClick={openCreate} leftIcon={<Plus size={16} />}>Novo Cliente</Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Loja:</span>
          <select value={selectedStore ?? ''} onChange={(e) => setSelectedStore(Number(e.target.value))} className="input">
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="divide-y divide-transparent">
            <div className="bg-gray-50/50 rounded-xl px-6 py-3 mb-2 flex items-center">
              <div className="w-1/2 text-xs font-medium text-gray-600 uppercase">Cliente</div>
              <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Status</div>
              <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Contato</div>
              <div className="w-24"></div>
            </div>
              
            <div className="space-y-2">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center px-6 py-3 hover:bg-orange-50/80 rounded-xl transition-colors">
                  <div className="w-1/2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <Avatar src={c.imageUrl} alt={c.name} size="md" />
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      c.status === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      c.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {c.status === 'NEW' ? 'Novo' :
                       c.status === 'ACTIVE' ? 'Ativo' :
                       c.status === 'VIP' ? 'VIP' :
                       c.status === 'WARNING' ? 'Alerta' :
                       'Bloqueado'}
                    </span>
                  </div>
                  <div className="w-1/4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    <div className="text-sm">
                      {c.email && <div>{c.email}</div>}
                      {c.phone && <div className="text-gray-500">{c.phone}</div>}
                      {!c.email && !c.phone && <div className="text-gray-400">Sem contato</div>}
                    </div>
                  </div>
                  <div className="w-24 flex gap-2 justify-end">
                    <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                      <Edit size={14} className="text-gray-500" />
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
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nome</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full input" required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full input" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Telefone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full input" />
                </div>
                <div>
                  <label className="block text-sm mb-1">URL da Imagem</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full input" required />
                </div>
                {editing && (
                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select 
                      value={form.status} 
                      onChange={(e) => setForm({ ...form, status: e.target.value as Customer['status'] })}
                      className="w-full input"
                    >
                      <option value="NEW">Novo</option>
                      <option value="ACTIVE">Ativo</option>
                      <option value="VIP">VIP</option>
                      <option value="WARNING">Alerta</option>
                      <option value="BLOCKED">Bloqueado</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  {editing && (
                    <Button 
                      type="button" 
                      variant="danger" 
                      onClick={() => {
                        setIsOpen(false);
                        deleteCustomer(editing.id);
                      }}
                    >
                      Deletar
                    </Button>
                  )}
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
