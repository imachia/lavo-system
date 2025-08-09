'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import { useAuthStore } from '../lib/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user.role} />
      <Header />
      
      <main className="pt-20 lg:pt-20 lg:pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
