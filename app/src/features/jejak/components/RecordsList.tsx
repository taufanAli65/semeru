'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { showConfirm, showToast } from '@/lib/notifications';
import type { MonevRecord } from '../types';
import { menteeService } from '../services/mentee.service';

interface RecordsListProps {
  records: MonevRecord[];
  onRecordUpdate: () => void;
}

export const RecordsList = ({ records, onRecordUpdate }: RecordsListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
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

  const handleDelete = async (recordId: string) => {
    const confirmed = await showConfirm.delete(
      'Delete this record?',
      'This action cannot be undone and will permanently remove this achievement record.'
    );

    if (!confirmed) return;

    try {
      setDeletingId(recordId);
      await menteeService.deleteRecord(recordId);
      onRecordUpdate();
      showToast.success('Record deleted successfully');
    } catch (error) {
      console.error('Failed to delete record:', error);
      showToast.error('Failed to delete record');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (fileUrl: string, title: string) => {
    window.open(fileUrl, '_blank');
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No records yet</h3>
        <p className="text-gray-600">
          Start building your achievement portfolio by adding your first record!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.record_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {getStatusIcon(record.status)}
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {record.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 text-sm">{record.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {record.category}
                  </span>
                  {record.grade_value && (
                    <span className="hidden sm:inline-block">•</span>
                  )}
                  {record.grade_value && (
                    <span>Grade: {record.grade_value}</span>
                  )}
                  <span className="hidden sm:inline-block">•</span>
                  <span>
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                </div>

                {record.reviewer_notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-sm text-gray-700">
                      <strong>Review Notes:</strong> {record.reviewer_notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:ml-4 border-gray-100">
                {record.file_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(record.file_url!, record.title)}
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={record.status === 'Verified'}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(record.record_id)}
                  disabled={deletingId === record.record_id || record.status === 'Verified'}
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};