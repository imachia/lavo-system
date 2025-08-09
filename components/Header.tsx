'use client';

import { User } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';

export default function Header() {
  const { user } = useAuthStore();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADM':
        return 'Administrador';
      case 'LOJISTA':
        return 'Lojista';
      case 'TECNICO':
        return 'Técnico';
      default:
        return role;
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Lavo System</h1>
              {user && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User size={14} />
                  <span>{user.name}</span>
                  <span>•</span>
                  <span className="font-medium">{getRoleLabel(user.role)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
