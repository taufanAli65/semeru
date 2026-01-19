import api from '@/lib/axios';
import type {
  MonevRecord,
  MenteeInfo,
  MenteeListResponse,
  PeriodRecordsResponse,
  AssignMenteesRequest,
  ApproveRecordRequest,
} from '../types/mentor.type';

class MentorService {
  // Assign mentees to mentor
  async assignMentees(mentorId: string, data: AssignMenteesRequest): Promise<void> {
    await api.post(`/jejak/mentor/${mentorId}/mentees`, data);
  }

  // Get mentee list
  async getMenteeList(
    mentorId: string,
    params?: { semester?: number; status?: 'Complete' | 'Incomplete'; page?: number; limit?: number }
  ): Promise<MenteeListResponse> {
    const response = await api.get(`/jejak/mentor/${mentorId}/mentees`, { params });
    return response.data.data;
  }

  // Approve/Reject monev record
  async approveRecord(recordId: string, data: ApproveRecordRequest): Promise<void> {
    await api.patch(`/jejak/mentor/records/${recordId}`, data);
  }

  // Get monev records by period
  async getRecordsByPeriod(periodId: string): Promise<PeriodRecordsResponse> {
    const response = await api.get(`/jejak/mentor/period/${periodId}/records`);
    return response.data.data;
  }

  // Get single monev record
  async getSingleRecord(recordId: string): Promise<MonevRecord> {
    const response = await api.get(`/jejak/mentor/records/${recordId}`);
    return response.data.data;
  }
}

export const mentorService = new MentorService();