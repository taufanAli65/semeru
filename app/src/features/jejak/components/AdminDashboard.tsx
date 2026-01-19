'use client';

import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-semeru-50">
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isActive={true}
        />
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="User Management"
        />
        <SidebarItem
          icon={<FileText className="h-5 w-5" />}
          label="Content Review"
        />
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="System Settings"
        />
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-semeru-600 to-semeru-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Admin Dashboard 🛡️
                  </h1>
                  <p className="text-semeru-100 text-lg">
                    Manage users, content, and system settings.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Shield className="h-16 w-16 text-semeru-200" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-semeru-200 bg-linear-to-br from-semeru-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-semeru-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-semeru-600">1,234</div>
                  <p className="text-xs text-semeru-500 mt-1">Registered users</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Total Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">5,678</div>
                  <p className="text-xs text-blue-500 mt-1">Achievement records</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-linear-to-br from-green-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <p className="text-xs text-green-500 mt-1">Current sessions</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <p className="text-xs text-purple-500 mt-1">Uptime</p>
                </CardContent>
              </Card>
            </div>

            {/* Admin Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-semeru-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-semeru-600" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Manage user accounts, roles, and permissions
                  </p>
                  <button className="w-full bg-semeru-600 text-white py-2 px-4 rounded-lg hover:bg-semeru-700 transition-colors">
                    Manage Users
                  </button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Content Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Review and moderate user-submitted content
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Review Content
                  </button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Configure system settings and preferences
                  </p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    System Settings
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Achievement record approved</p>
                      <p className="text-xs text-gray-600">5 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System backup completed</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};