import type { MonevRecord } from './mentee.type';

// Re-export service types
export type {
  MonevRecord,
  PeriodData,
  CurrentPeriodResponse,
  PastRecordsResponse,
  AddRecordRequest,
  UpdateRecordRequest,
  BulkAddRecordsRequest,
} from './mentee.type';

export type {
  MenteeInfo,
  MenteeListResponse,
  PeriodRecordsResponse,
  AssignMenteesRequest,
  ApproveRecordRequest,
} from './mentor.type';

// Additional UI-specific types

// Additional UI-specific types
export interface DashboardStats {
  totalRecords: number;
  pendingRecords: number;
  verifiedRecords: number;
  rejectedRecords: number;
  currentSemester: number;
  completionPercentage: number;
}

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface RecordFormData {
  category: MonevRecord['category'];
  title: string;
  description: string;
  grade_value?: number;
  file?: File;
}