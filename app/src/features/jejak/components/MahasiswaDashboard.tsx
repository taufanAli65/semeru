'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  LayoutDashboard,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Users,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { showToast, showConfirm } from '@/lib/notifications';
import { menteeService } from '../services/mentee.service';
import { DashboardStats, CurrentPeriodResponse, PastRecordsResponse } from '../types';
import { AddRecordModal } from './AddRecordModal';
import { RecordsList } from './RecordsList';
import { PastRecordsView } from './PastRecordsView';

export const MahasiswaDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [currentRecords, setCurrentRecords] = useState<CurrentPeriodResponse | null>(null);
  const [pastRecords, setPastRecords] = useState<PastRecordsResponse | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [currentData, pastData] = await Promise.all([
        menteeService.getCurrentRecords(),
        menteeService.getPastRecords()
      ]);

      setCurrentRecords(currentData);
      setPastRecords(pastData);

      // Calculate stats
      const currentStats = calculateStats(currentData);
      setStats(currentStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (currentData: CurrentPeriodResponse): DashboardStats => {
    const records = currentData.records;
    const totalRecords = records.length;
    const pendingRecords = records.filter(r => r.status === 'Pending').length;
    const verifiedRecords = records.filter(r => r.status === 'Verified').length;
    const rejectedRecords = records.filter(r => r.status === 'Fail').length;

    // Calculate completion percentage (assuming 5 records minimum per semester)
    const minRequired = 5;
    const completionPercentage = Math.min((totalRecords / minRequired) * 100, 100);

    return {
      totalRecords,
      pendingRecords,
      verifiedRecords,
      rejectedRecords,
      currentSemester: currentData.semester,
      completionPercentage
    };
  };

  const handleRecordAdded = () => {
    loadDashboardData();
    setShowAddModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-semeru-50">
        <Sidebar>
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={true}
          />
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-semeru-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your achievements...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-semeru-600 to-semeru-700 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.information?.name || 'Student'}! 👋
                  </h1>
                  <p className="text-semeru-100 text-lg">
                    Keep pushing forward! Your journey to excellence continues.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Target className="h-16 w-16 text-semeru-200" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-semeru-200 bg-linear-to-br from-semeru-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-semeru-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Total Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-semeru-600">{stats.totalRecords}</div>
                    <p className="text-xs text-semeru-500 mt-1">This semester</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingRecords}</div>
                    <p className="text-xs text-yellow-500 mt-1">Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-linear-to-br from-green-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.verifiedRecords}</div>
                    <p className="text-xs text-green-500 mt-1">Approved records</p>
                  </CardContent>
                </Card>

                <Card className="border-semeru-200 bg-linear-to-br from-semeru-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-semeru-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-semeru-600">{stats.completionPercentage.toFixed(0)}%</div>
                    <p className="text-xs text-semeru-500 mt-1">Semester completion</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Motivational Quote */}
            <Card className="bg-linear-to-r from-semeru-500 to-semeru-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <div>
                    <p className="text-lg font-semibold mb-1">"Success is not final, failure is not fatal: It is the courage to continue that counts."</p>
                    <p className="text-semeru-100">— Winston Churchill</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Achievements</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Track your academic and extracurricular accomplishments
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-semeru-600 hover:bg-semeru-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>

                {/* Tab Navigation */}
                <div className="px-6 pb-4">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab('current')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'current'
                          ? 'bg-semeru-100 text-semeru-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Current Semester
                    </button>
                    <button
                      onClick={() => setActiveTab('past')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'past'
                          ? 'bg-semeru-100 text-semeru-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Past Semesters
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'current' && currentRecords && (
                  <RecordsList
                    records={currentRecords.records}
                    onRecordUpdate={loadDashboardData}
                  />
                )}

                {activeTab === 'past' && pastRecords && (
                  <PastRecordsView periods={pastRecords.periods} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <AddRecordModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRecordAdded}
        />
      )}
    </div>
  );
};