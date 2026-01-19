import api from '@/lib/axios';
import type {
  MonevRecord,
  PeriodData,
  CurrentPeriodResponse,
  PastRecordsResponse,
  AddRecordRequest,
  UpdateRecordRequest,
  BulkAddRecordsRequest,
} from '../types/mentee.type';

class MenteeService {
  // Get current period records
  async getCurrentRecords(): Promise<CurrentPeriodResponse> {
    const response = await api.get('/jejak/mentee/records/current');
    return response.data.data;
  }

  // Add single monev record
  async addRecord(formData: FormData): Promise<MonevRecord> {
    const response = await api.post('/jejak/mentee/records', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Add bulk monev records
  async addBulkRecords(formData: FormData): Promise<MonevRecord[]> {
    const response = await api.post('/jejak/mentee/records/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Update monev record
  async updateRecord(recordId: string, formData: FormData): Promise<MonevRecord> {
    const response = await api.patch(`/jejak/mentee/records/${recordId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Delete monev record
  async deleteRecord(recordId: string): Promise<void> {
    await api.delete(`/jejak/mentee/records/${recordId}`);
  }

  // Get past records
  async getPastRecords(): Promise<PastRecordsResponse> {
    const response = await api.get('/jejak/mentee/records/past');
    return response.data.data;
  }
}

export const menteeService = new MenteeService();