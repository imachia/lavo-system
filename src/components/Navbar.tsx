"use client";

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Settings, LogOut, Menu, X, Store, Wrench, Users, Activity } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useSystemStore } from '@/lib/system-store';

interface NavbarProps { userRole: 'ADM' | 'LOJISTA' | 'TECNICO' | string }

export default function Navbar({ userRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const { config: { systemName, logoUrl } } = useSystemStore();

  const handleLogout = () => { logout(); router.push('/login'); };

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['ADM', 'LOJISTA', 'TECNICO'] },
    { icon: Store, label: 'Lojas', href: '/dashboard/lojas', roles: ['ADM', 'LOJISTA'] },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes', roles: ['ADM', 'LOJISTA'] },
    { icon: Activity, label: 'Tráfego', href: '/dashboard/trafego', roles: ['ADM', 'LOJISTA'], prefetch: true },
    { icon: Wrench, label: 'Vincular Dispositivo', href: '/dashboard/vinculacao', roles: ['ADM', 'TECNICO'] },
    { icon: Settings, label: 'Dispositivos', href: '/dashboard/dispositivos', roles: ['ADM', 'LOJISTA'] },
    { icon: Settings, label: 'Config. do Sistema', href: '/dashboard/config-sistema', roles: ['ADM'] },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes', roles: ['ADM', 'LOJISTA', 'TECNICO'] }
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full text-gray-700 shadow"
        aria-label="Abrir menu"
        variant="ghost"
        size="sm"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-900 shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:ml-4 lg:my-4 lg:h-[calc(100vh-2rem)] lg:rounded-3xl overflow-hidden border border-gray-100`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 pt-8 pb-4 flex flex-col items-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="w-40 h-40 object-contain mb-3" />
            ) : (
              <div className="w-32 h-32 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            )}
            <h1 className="text-sm font-semibold text-center text-gray-700">{systemName}</h1>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
              >
                <item.icon size={18} className="mr-3 group-hover:text-blue-500" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
            >
              <LogOut size={18} className="mr-3 group-hover:text-blue-500" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
