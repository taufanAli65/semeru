'use client';

import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { LayoutDashboard } from 'lucide-react';
import { StudentContent } from './StudentContent';

export const MahasiswaDashboard = () => {
  return (
    <div className="flex h-screen bg-semeru-50">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={true}
        />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <StudentContent />
          </div>
        </main>
      </div>
    </div>
  );
};