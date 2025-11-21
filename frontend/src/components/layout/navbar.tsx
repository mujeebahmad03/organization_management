'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { FiLogOut, FiUser } from 'react-icons/fi';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Organization Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <FiUser className="w-4 h-4" />
              <span>{user?.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <FiLogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

