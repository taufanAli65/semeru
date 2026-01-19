// Types for Mentee Service

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

export interface PeriodData {
  period_id: string;
  semester: number;
  status: 'Incomplete' | 'Complete';
  general_feedback?: string;
  created_at: string;
  updated_at: string;
  records: MonevRecord[];
}

export interface CurrentPeriodResponse {
  period_id: string;
  semester: number;
  status: 'Incomplete' | 'Complete';
  records: MonevRecord[];
}

export interface PastRecordsResponse {
  periods: PeriodData[];
}

export interface AddRecordRequest {
  category: MonevRecord['category'];
  title: string;
  description?: string;
  grade_value?: number;
}

export interface UpdateRecordRequest {
  title?: string;
  description?: string;
  grade_value?: number;
}

export interface BulkAddRecordsRequest {
  records: AddRecordRequest[];
  files?: File[];
}