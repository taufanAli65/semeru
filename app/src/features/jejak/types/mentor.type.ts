// Types for Mentor Service

export interface MonevRecord {
  record_id: string;
  category: 'Prestasi' | 'Seminar' | 'Kepemimpinan' | 'Pelatihan' | 'Akademik' | 'Publikasi' | 'Kecendekiawanan';
  title: string;
  description?: string;
  file_url?: string;
  grade_value?: number;
  status: 'Pending' | 'Verified' | 'Fail';
  reviewer_notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MenteeInfo {
  user_id: string;
  period_id: string;
}

export interface MenteeListResponse {
  items: MenteeInfo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PeriodRecordsResponse {
  period_id: string;
  records: MonevRecord[];
}

export interface AssignMenteesRequest {
  userIds: string[];
  semester: number;
}

export interface ApproveRecordRequest {
  status: 'Verified' | 'Fail';
  notes?: string;
}