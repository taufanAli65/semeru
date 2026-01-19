'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, XCircle, Clock, Calendar, Award } from 'lucide-react';
import type { PeriodData } from '../types';

interface PastRecordsViewProps {
  periods: PeriodData[];
}

export const PastRecordsView = ({ periods }: PastRecordsViewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (periods.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No past records</h3>
        <p className="text-gray-600">
          Your past semester achievements will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {periods.map((period) => (
        <Card key={period.period_id} className="border-l-4 border-l-semeru-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-semeru-600" />
                Semester {period.semester}
              </CardTitle>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                period.status === 'Complete'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {period.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Completed on {new Date(period.updated_at).toLocaleDateString()}
            </p>
            {period.general_feedback && (
              <div className="mt-2 p-3 bg-semeru-50 rounded-md">
                <p className="text-sm text-semeru-700">
                  <strong>Mentor Feedback:</strong> {period.general_feedback}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {period.records.map((record) => (
                <div key={record.record_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(record.status)}
                        <h4 className="font-medium text-gray-900">{record.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">{record.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{record.category}</span>
                        {record.grade_value && <span>Grade: {record.grade_value}</span>}
                        {record.verified_at && (
                          <span>Verified: {new Date(record.verified_at).toLocaleDateString()}</span>
                        )}
                      </div>

                      {record.reviewer_notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {record.reviewer_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {period.records.length === 0 && (
                <p className="text-gray-500 text-center py-4">No records for this semester</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};