'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store,
  Wrench
} from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';

interface NavbarProps {
  userRole: string;
}

export default function Navbar({ userRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard', roles: ['ADM', 'LOJISTA', 'TECNICO'] },
    { icon: Store, label: 'Gerenciar Lojistas', href: '/dashboard/lojistas', roles: ['ADM'] },
    { icon: Wrench, label: 'Técnico', href: '/dashboard/tecnico', roles: ['TECNICO'] },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes', roles: ['ADM', 'LOJISTA', 'TECNICO'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-bold">Lavo System</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
