'use client';

import Button from '@/components/ui/Button';
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Shield, Bell, Eye, Save } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    shareUsageData: false
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Eye }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de atualização
    console.log('Dados do formulário:', formData);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações
          </h1>
          <p className="text-gray-600">
            Gerencie suas configurações pessoais e preferências.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)]">
          {/* Tabs */}
          <div className="px-6 py-4 flex items-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="sm"
              >
                <tab.icon size={16} />
                {tab.label}
              </Button>
            ))}
          </div>
          <div className="h-px bg-gray-100" />

          {/* Conteúdo das tabs */}
          <div className="p-6 space-y-6">
            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                    <p className="text-sm text-gray-500">Receba atualizações importantes por email</p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.notifications.email}
                      onChange={(e) => {
                        handleInputChange('notifications.email', e.target.checked);
                        console.log('Email notification:', e.target.checked);
                      }}
                    />
                    <div 
                      className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.notifications.email ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                    <div 
                      className={`absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        formData.notifications.email ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Notificações Push</h3>
                    <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.notifications.push}
                      onChange={(e) => {
                        handleInputChange('notifications.push', e.target.checked);
                        console.log('Push notification:', e.target.checked);
                      }}
                    />
                    <div 
                      className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.notifications.push ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                    <div 
                      className={`absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        formData.notifications.push ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Notificações SMS</h3>
                    <p className="text-sm text-gray-500">Receba alertas por SMS</p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.notifications.sms}
                      onChange={(e) => {
                        handleInputChange('notifications.sms', e.target.checked);
                        console.log('SMS notification:', e.target.checked);
                      }}
                    />
                    <div 
                      className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.notifications.sms ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                    <div 
                      className={`absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        formData.notifications.sms ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => console.log('Salvando notificações:', formData.notifications)} 
                    leftIcon={<Save size={16} />}
                  >
                    Salvar Preferências
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="flex items-center px-4 py-2"
                  leftIcon={<Save size={16} className="mr-2" />}
                >
                  Salvar Alterações
                </Button>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="flex items-center px-4 py-2"
                  leftIcon={<Save size={16} className="mr-2" />}
                >
                  Alterar Senha
                </Button>
              </form>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Política de Privacidade</h3>
                  <p className="text-sm text-blue-700">
                    Suas informações pessoais são protegidas e nunca serão compartilhadas com terceiros sem seu consentimento.
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Compartilhar dados de uso</h3>
                    <p className="text-sm text-gray-500">Permitir que coletemos dados anônimos para melhorar o sistema</p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.shareUsageData}
                      onChange={(e) => {
                        handleInputChange('shareUsageData', e.target.checked);
                        console.log('Share usage data:', e.target.checked);
                      }}
                    />
                    <div 
                      className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.shareUsageData ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                    <div 
                      className={`absolute inset-y-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        formData.shareUsageData ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>

                <Button leftIcon={<Save size={16} />}>
                  Salvar Preferências
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
