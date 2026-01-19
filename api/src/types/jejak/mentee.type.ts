import { UUID } from "node:crypto";
import { monevCategory, recordStatus } from "@prisma/client";

export interface CreateMonevRecord {
    category: monevCategory;
    title: string;
    description?: string;
    file_url: string;
    grade_value?: number;
}

export interface BulkCreateMonevRecord {
    records: CreateMonevRecord[];
}

export interface UpdateMonevRecord {
    title?: string;
    description?: string;
    file_url?: string;
    grade_value?: number;
}

export interface MonevRecordResponse {
    record_id: UUID;
    category: monevCategory;
    title: string;
    description: string;
    file_url: string;
    grade_value?: number;
    status: recordStatus;
    reviewer_notes?: string;
    verified_by?: UUID;
    verified_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CurrentPeriodRecords {
    period_id: UUID;
    semester: number;
    status: string;
    records: MonevRecordResponse[];
}

export interface PastPeriodRecord {
    period_id: UUID;
    semester: number;
    status: string;
    records: MonevRecordResponse[];
    general_feedback?: string;
    created_at: Date;
    updated_at: Date;
}

export interface PastRecordsResponse {
    periods: PastPeriodRecord[];
}