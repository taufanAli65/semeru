import { UUID } from "node:crypto";
import { monevCategory, recordStatus } from "@prisma/client";

export interface MenteeList {
    user_id: UUID;
    period_id: UUID;
}

export interface MonevRecord {
    record_id: UUID;
    category: monevCategory;
    title: string;
    description: string;
    file_url: string;
    status: recordStatus;
    reviewer_notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface MonevRecords {
    period_id: UUID;
    records: {
        record_id: UUID;
        category: monevCategory;
        title: string;
        description: string;
        file_url: string;
        status: recordStatus;
        reviewer_notes?: string;
        created_at: Date;
        updated_at: Date;
    }[]
}