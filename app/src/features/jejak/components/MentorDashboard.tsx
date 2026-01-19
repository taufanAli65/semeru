'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { showToast, showConfirm } from '@/lib/notifications';
import { mentorService } from '../services/mentor.service';
import { MenteeListResponse, PeriodRecordsResponse } from '../types';

export const MentorDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'mentees' | 'reviews'>('mentees');
  const [mentees, setMentees] = useState<MenteeListResponse | null>(null);
  const [selectedMentee, setSelectedMentee] = useState<string | null>(null);
  const [menteeRecords, setMenteeRecords] = useState<PeriodRecordsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMentees();
  }, []);

  const loadMentees = async () => {
    try {
      setIsLoading(true);
      const response = await mentorService.getMenteeList(user?.user_id || '');
      setMentees(response);
    } catch (error) {
      console.error('Failed to load mentees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenteeRecords = async (periodId: string) => {
    try {
      const response = await mentorService.getRecordsByPeriod(periodId);
      setMenteeRecords(response);
    } catch (error) {
      console.error('Failed to load mentee records:', error);
    }
  };

  const handleMenteeSelect = (mentee: any) => {
    setSelectedMentee(mentee.period_id);
    loadMenteeRecords(mentee.period_id);
  };

  const handleApproveRecord = async (recordId: string, status: 'Verified' | 'Fail', notes?: string) => {
    let confirmed = false;
    let reviewNotes = notes;

    if (status === 'Verified') {
      confirmed = await showConfirm.approve(
        'Approve this record?',
        'This will mark the record as verified and notify the student.'
      );
    } else {
      reviewNotes = await showConfirm.reject();
      confirmed = !!reviewNotes;
    }

    if (!confirmed) return;

    try {
      await mentorService.approveRecord(recordId, { status, notes: reviewNotes });
      if (selectedMentee) {
        loadMenteeRecords(selectedMentee);
      }
      showToast.success(`Record ${status === 'Verified' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Failed to approve record:', error);
      showToast.error('Failed to update record status');
    }
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
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Mentees"
          />
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-semeru-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading mentor dashboard...</p>
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
        <SidebarItem
          icon={<Users className="h-5 w-5" />}
          label="Mentees"
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
                    Welcome back, Mentor {user?.information?.name || 'Mentor'}! 👨‍🏫
                  </h1>
                  <p className="text-semeru-100 text-lg">
                    Guide your mentees towards excellence and success.
                  </p>
                </div>
                <div className="hidden md:block">
                  <UserCheck className="h-16 w-16 text-semeru-200" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {mentees && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-semeru-200 bg-linear-to-br from-semeru-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-semeru-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Mentees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-semeru-600">{mentees.meta.total}</div>
                    <p className="text-xs text-semeru-500 mt-1">Active mentees</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {mentees.items.length}
                    </div>
                    <p className="text-xs text-yellow-500 mt-1">Active mentees</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-linear-to-br from-green-50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {mentees.meta.total}
                    </div>
                    <p className="text-xs text-green-500 mt-1">Total assigned</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mentees List */}
              <div className="lg:col-span-1">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your Mentees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mentees?.items.map((mentee) => (
                        <button
                          key={mentee.period_id}
                          onClick={() => handleMenteeSelect(mentee)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedMentee === mentee.period_id
                              ? 'bg-semeru-100 border-semeru-300'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                Mentee {mentee.user_id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Period ID: {mentee.period_id.slice(0, 8)}
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              Active
                            </span>
                          </div>
                        </button>
                      ))}

                      {(!mentees || mentees.items.length === 0) && (
                        <p className="text-gray-500 text-center py-4">
                          No mentees assigned yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Records Review */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {selectedMentee ? 'Review Records' : 'Select a Mentee'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMentee && menteeRecords ? (
                      <div className="space-y-4">
                        {menteeRecords.records.map((record) => (
                          <div key={record.record_id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {record.title}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2">
                                  {record.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{record.category}</span>
                                  {record.grade_value && <span>Grade: {record.grade_value}</span>}
                                  <span className={`px-2 py-1 rounded-full ${
                                    record.status === 'Verified'
                                      ? 'bg-green-100 text-green-800'
                                      : record.status === 'Fail'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {record.status}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {record.status === 'Pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApproveRecord(record.record_id, 'Verified')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const notes = prompt('Review notes:');
                                        if (notes) {
                                          handleApproveRecord(record.record_id, 'Fail', notes);
                                        }
                                      }}
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {record.file_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(record.file_url, '_blank')}
                              >
                                View File
                              </Button>
                            )}
                          </div>
                        ))}

                        {menteeRecords.records.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No records submitted yet
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Select a mentee from the list to review their records
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};