'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-in">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
