'use client';

import Button from '@/components/ui/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';

export default function TecnicoPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'TECNICO') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'TECNICO') {
    return null;
  }

  // Dados mockados para o técnico
  const servicos = [
    {
      id: 1,
      cliente: 'João Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      servico: 'Manutenção de Sistema',
      status: 'pendente',
      data: '2024-01-15',
      hora: '14:00'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      endereco: 'Av. Principal, 456 - Jardim',
      telefone: '(11) 88888-8888',
      servico: 'Instalação de Equipamento',
      status: 'em_andamento',
      data: '2024-01-15',
      hora: '10:30'
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      endereco: 'Rua do Comércio, 789 - Vila',
      telefone: '(11) 77777-7777',
      servico: 'Configuração de Rede',
      status: 'concluido',
      data: '2024-01-14',
      hora: '16:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Técnico
          </h1>
          <p className="text-gray-600">
            Gerencie seus serviços e agendamentos técnicos.
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Serviços Hoje</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500 text-white">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avaliação</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Serviços Agendados
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {servicos.map((servico) => (
              <div key={servico.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {servico.cliente}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(servico.status)}`}>
                        {getStatusLabel(servico.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {servico.servico}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {servico.endereco}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {servico.telefone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(servico.data).toLocaleDateString('pt-BR')} às {servico.hora}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" className="px-3 py-1" variant="primary">Iniciar</Button>
                    <Button size="sm" className="px-3 py-1" variant="ghost">Detalhes</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de próximos agendamentos */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Agendamentos
          </h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Cliente {item}</p>
                  <p className="text-sm text-gray-600">Manutenção Preventiva</p>
                  <p className="text-xs text-gray-500">Amanhã às 09:00</p>
                </div>
                <Button size="sm" className="px-3 py-1" variant="primary">Confirmar</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
