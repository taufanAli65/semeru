'use client';

import { useAuthStore } from '@/lib/store';
import { MahasiswaDashboard } from '@/features/jejak/components/MahasiswaDashboard';
import { MentorDashboard } from '@/features/jejak/components/MentorDashboard';
import { AdminDashboard } from '@/features/jejak/components/AdminDashboard';
import { SuperAdminDashboard } from '@/features/jejak/components/SuperAdminDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const roles = user.roles || [];

  // SuperAdmin takes precedence
  if (roles.includes('SuperAdmin')) {
    return <SuperAdminDashboard />;
  }

  // Admin takes second precedence
  if (roles.includes('Admin')) {
    return <AdminDashboard />;
  }

  // Mentor takes precedence over Mahasiswa
  if (roles.includes('Mentor')) {
    // MentorDashboard now includes "My Achievements" (Student view) tab
    return <MentorDashboard />;
  }

  // Mahasiswa fallback
  if (roles.includes('Mahasiswa')) {
    return <MahasiswaDashboard />;
  }

  // Fallback for no valid role
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h1>
        <p className="text-gray-600">Your account does not have a recognized role.</p>
      </div>
    </div>
  );
}