'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Plus,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    Target,
    Star
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { menteeService } from '../services/mentee.service';
import { DashboardStats, CurrentPeriodResponse, PastRecordsResponse } from '../types';
import { AddRecordModal } from './AddRecordModal';
import { RecordsList } from './RecordsList';
import { PastRecordsView } from './PastRecordsView';

export const StudentContent = () => {
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

            // Calculate stats only if currentData exists
            if (currentData) {
                const currentStats = calculateStats(currentData);
                setStats(currentStats);
            } else {
                setStats(null);
            }
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
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-semeru-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white border-l-4 border-semeru-600 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back, {user?.information?.name || 'Student'}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Keep pushing forward! Your journey to excellence continues.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="bg-semeru-50 p-3 rounded-full">
                            <Target className="h-8 w-8 text-semeru-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white border-gray-200 shadow-sm hover:border-semeru-300 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-semeru-500" />
                                Total Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalRecords}</div>
                            <p className="text-xs text-gray-500 mt-1">This semester</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:border-yellow-300 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-500" />
                                Pending Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.pendingRecords}</div>
                            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:border-green-300 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Verified
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.verifiedRecords}</div>
                            <p className="text-xs text-gray-500 mt-1">Approved records</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200 shadow-sm hover:border-semeru-300 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-semeru-500" />
                                Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.completionPercentage.toFixed(0)}%</div>
                            <p className="text-xs text-gray-500 mt-1">Semester completion</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Motivational Quote */}
            <Card className="bg-white border-l-4 border-yellow-400 shadow-sm rounded-lg p-0">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Star className="h-6 w-6 text-yellow-400 mt-1 shrink-0" />
                        <div>
                            <p className="text-lg font-medium text-gray-800 italic mb-2">"Success is not final, failure is not fatal: It is the courage to continue that counts."</p>
                            <p className="text-sm text-gray-500">— Winston Churchill</p>
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
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'current'
                                    ? 'bg-semeru-100 text-semeru-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Current Semester
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'past'
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
                    {activeTab === 'current' && !currentRecords && (
                        <div className="text-center py-12">
                            <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Periode Monev Belum Dimulai</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Saat ini belum ada periode monitoring dan evaluasi yang aktif untuk semester Anda.
                                Silakan hubungi mentor Anda untuk informasi lebih lanjut.
                            </p>
                        </div>
                    )}

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
