'use client';

import { useAuthStore } from '@/lib/auth-store';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 z-30">
      <div className="mx-4 mt-4">
        <div className="px-6 py-4 flex items-center justify-end bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.role || ''}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-base font-medium text-white">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

