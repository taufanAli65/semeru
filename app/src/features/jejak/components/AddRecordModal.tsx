'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Upload, FileText } from 'lucide-react';
import { menteeService } from '../services/mentee.service';
import { RecordFormData, FileUploadState } from '../types';
import { showToast } from '@/lib/notifications';

interface AddRecordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRecordModal = ({ onClose, onSuccess }: AddRecordModalProps) => {
  const [formData, setFormData] = useState<RecordFormData>({
    category: 'Prestasi',
    title: '',
    description: '',
    grade_value: undefined,
  });

  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    preview: null,
    isUploading: false,
    error: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileState({
        file,
        preview: file.name,
        isUploading: false,
        error: null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileState.file) {
      setFileState(prev => ({ ...prev, error: 'Please select a file' }));
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('file', fileState.file);
      submitData.append('category', formData.category);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      if (formData.grade_value) {
        submitData.append('grade_value', formData.grade_value.toString());
      }

      await menteeService.addRecord(submitData);
      showToast.success('Achievement record added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Failed to add record:', error);
      showToast.error('Failed to add achievement record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Achievement</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semeru-500"
                required
              >
                <option value="Prestasi">Prestasi (Achievements)</option>
                <option value="Seminar">Seminar</option>
                <option value="Kepemimpinan">Kepemimpinan (Leadership)</option>
                <option value="Pelatihan">Pelatihan (Training)</option>
                <option value="Akademik">Akademik (Academic)</option>
                <option value="Publikasi">Publikasi (Publications)</option>
                <option value="Kecendekiawanan">Kecendekiawanan (Social Activities)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Achievement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your achievement"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semeru-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Value (Optional)
              </label>
              <Input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={formData.grade_value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, grade_value: parseFloat(e.target.value) || undefined }))}
                placeholder="0-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {fileState.preview || 'Click to upload file'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PDF, DOC, Images up to 10MB
                  </span>
                </label>
              </div>
              {fileState.error && (
                <p className="text-red-500 text-sm mt-1">{fileState.error}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-semeru-600 hover:bg-semeru-700"
              >
                {isSubmitting ? 'Uploading...' : 'Add Achievement'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};