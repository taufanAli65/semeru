'use client';

import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { LayoutDashboard, Users, Settings, FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={true}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="Users"
        />
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          label="Content"
        />
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
        />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Dashboard cards would go here */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-semeru-600 mt-2">1,234</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                <p className="text-3xl font-bold text-semeru-600 mt-2">89</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">Content Items</h3>
                <p className="text-3xl font-bold text-semeru-600 mt-2">456</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-3xl font-bold text-semeru-600 mt-2">$12,345</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <p className="text-gray-600">Dashboard content coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}