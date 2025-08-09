'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import Navbar from './Navbar';
import Header from './Header';

interface DashboardLayoutProps { children: ReactNode }

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar userRole={user.role} />
      <div className="lg:pl-72">
        <Header />
        <main className="mt-32 px-4 pb-6">{children}</main>
      </div>
    </div>
  );
}

