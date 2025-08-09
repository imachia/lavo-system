'use client';

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function LojistasPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADM') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'ADM') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Lojistas
          </h1>
          <p className="text-gray-600">
            Gerencie os lojistas cadastrados no sistema.
          </p>
        </div>

        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar lojistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button leftIcon={<Plus size={20} />} className="flex items-center px-4 py-2">Novo Lojista</Button>
        </div>

        {/* Tabela de usuários */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="divide-y divide-transparent">
                <div className="bg-gray-50/50 rounded-xl px-6 py-3 mb-2 flex items-center">
                  <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Nome</div>
                  <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Email</div>
                  <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Função</div>
                  <div className="w-1/4 text-xs font-medium text-gray-600 uppercase">Data de Cadastro</div>
                  <div className="w-32"></div>
                </div>
                
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center px-6 py-3 hover:bg-orange-50/80 rounded-xl transition-colors">
                      <div className="w-1/4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <div className="w-1/4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="w-1/4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADM' ? 'bg-red-100 text-red-800' :
                          user.role === 'LOJISTA' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="w-1/4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-sm">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="w-32 flex gap-2 justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-blue-500 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-green-500 hover:text-green-600">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum lojista encontrado.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
