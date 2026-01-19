'use client';

import { useAuthStore } from '@/lib/store';
import { MahasiswaDashboard } from '@/features/jejak/components/MahasiswaDashboard';
import { MentorDashboard } from '@/features/jejak/components/MentorDashboard';
import { AdminDashboard } from '@/features/jejak/components/AdminDashboard';

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

  // Role-based dashboard rendering
  switch (user.role) {
    case 'Mahasiswa':
      return <MahasiswaDashboard />;
    case 'Mentor':
      return <MentorDashboard />;
    case 'Admin':
    case 'SuperAdmin':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h1>
            <p className="text-gray-600">Your account role is not recognized.</p>
          </div>
        </div>
      );
  }
}