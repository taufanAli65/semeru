import { UUID } from 'node:crypto';
import { prisma } from '../../config/prisma.config';
import {
    CreateMonevRecord,
    BulkCreateMonevRecord,
    UpdateMonevRecord,
    MonevRecordResponse,
    CurrentPeriodRecords,
    PastRecordsResponse
} from '../../types/jejak/mentee.type';
import { monevCategory, recordStatus, periodStatus } from '@prisma/client';

// Helper function to get current period for a user
async function getCurrentPeriod(userId: UUID): Promise<{ period_id: UUID; semester: number } | null> {
    const userInfo = await prisma.user_information.findUnique({
        where: { user_id: userId },
        select: { semester: true }
    });

    if (!userInfo) {
        throw new Error('Informasi pengguna tidak ditemukan');
    }

    const currentSemester = parseInt(userInfo.semester);

    const period = await prisma.monev_periods.findFirst({
        where: {
            user_id: userId,
            semester: currentSemester
        },
        select: {
            period_id: true,
            semester: true
        }
    });

    return period ? {
        period_id: period.period_id as UUID,
        semester: period.semester
    } : null;
}

// Add single monev record
async function addMonevRecord(userId: UUID, recordData: CreateMonevRecord): Promise<MonevRecordResponse> {
    const period = await getCurrentPeriod(userId);
    if (!period) {
        throw new Error('Periode monev saat ini tidak ditemukan. Silakan hubungi mentor Anda.');
    }

    const record = await prisma.monev_records.create({
        data: {
            period_id: period.period_id,
            category: recordData.category,
            title: recordData.title,
            description: recordData.description,
            file_url: recordData.file_url,
            grade_value: recordData.grade_value,
        }
    });

    return {
        record_id: record.record_id as UUID,
        category: record.category,
        title: record.title,
        description: record.description ?? '',
        file_url: record.file_url,
        grade_value: record.grade_value ?? undefined,
        status: record.status,
        reviewer_notes: record.reviewer_notes ?? undefined,
        verified_by: record.verified_by as UUID | undefined,
        verified_at: record.verified_at ?? undefined,
        created_at: record.created_at,
        updated_at: record.updated_at,
    };
}

// Add bulk monev records
async function addBulkMonevRecords(userId: UUID, bulkData: BulkCreateMonevRecord): Promise<MonevRecordResponse[]> {
    const period = await getCurrentPeriod(userId);
    if (!period) {
        throw new Error('Periode monev saat ini tidak ditemukan. Silakan hubungi mentor Anda.');
    }

    const records = await prisma.monev_records.createManyAndReturn({
        data: bulkData.records.map(record => ({
            period_id: period.period_id,
            category: record.category,
            title: record.title,
            description: record.description,
            file_url: record.file_url,
            grade_value: record.grade_value,
        }))
    });

    return records.map(record => ({
        record_id: record.record_id as UUID,
        category: record.category,
        title: record.title,
        description: record.description ?? '',
        file_url: record.file_url,
        grade_value: record.grade_value ?? undefined,
        status: record.status,
        reviewer_notes: record.reviewer_notes ?? undefined,
        verified_by: record.verified_by as UUID | undefined,
        verified_at: record.verified_at ?? undefined,
        created_at: record.created_at,
        updated_at: record.updated_at,
    }));
}

// Get current period records
async function getCurrentPeriodRecords(userId: UUID): Promise<CurrentPeriodRecords | null> {
    const period = await getCurrentPeriod(userId);
    if (!period) {
        return null;
    }

    const periodWithRecords = await prisma.monev_periods.findUnique({
        where: { period_id: period.period_id },
        include: {
            monev_records: {
                orderBy: { created_at: 'desc' }
            }
        }
    });

    if (!periodWithRecords) {
        return null;
    }

    const records: MonevRecordResponse[] = periodWithRecords.monev_records.map(record => ({
        record_id: record.record_id as UUID,
        category: record.category,
        title: record.title,
        description: record.description ?? '',
        file_url: record.file_url,
        grade_value: record.grade_value ?? undefined,
        status: record.status,
        reviewer_notes: record.reviewer_notes ?? undefined,
        verified_by: record.verified_by as UUID | undefined,
        verified_at: record.verified_at ?? undefined,
        created_at: record.created_at,
        updated_at: record.updated_at,
    }));

    return {
        period_id: periodWithRecords.period_id as UUID,
        semester: periodWithRecords.semester,
        status: periodWithRecords.status,
        records
    };
}

// Update monev record (only current period)
async function updateMonevRecord(userId: UUID, recordId: UUID, updateData: UpdateMonevRecord): Promise<MonevRecordResponse> {
    const period = await getCurrentPeriod(userId);
    if (!period) {
        throw new Error('Periode monev saat ini tidak ditemukan');
    }

    // Check if record belongs to current period
    const record = await prisma.monev_records.findFirst({
        where: {
            record_id: recordId,
            period_id: period.period_id
        }
    });

    if (!record) {
        throw new Error('Record tidak ditemukan atau tidak dapat diubah (bukan periode saat ini)');
    }

    // Check if record is already verified
    if (record.status === recordStatus.Verified) {
        throw new Error('Record yang sudah diverifikasi tidak dapat diubah');
    }

    const updatedRecord = await prisma.monev_records.update({
        where: { record_id: recordId },
        data: {
            title: updateData.title,
            description: updateData.description,
            file_url: updateData.file_url,
            grade_value: updateData.grade_value,
        }
    });

    return {
        record_id: updatedRecord.record_id as UUID,
        category: updatedRecord.category,
        title: updatedRecord.title,
        description: updatedRecord.description ?? '',
        file_url: updatedRecord.file_url,
        grade_value: updatedRecord.grade_value ?? undefined,
        status: updatedRecord.status,
        reviewer_notes: updatedRecord.reviewer_notes ?? undefined,
        verified_by: updatedRecord.verified_by as UUID | undefined,
        verified_at: updatedRecord.verified_at ?? undefined,
        created_at: updatedRecord.created_at,
        updated_at: updatedRecord.updated_at,
    };
}

// Delete monev record (only current period)
async function deleteMonevRecord(userId: UUID, recordId: UUID): Promise<void> {
    const period = await getCurrentPeriod(userId);
    if (!period) {
        throw new Error('Periode monev saat ini tidak ditemukan');
    }

    // Check if record belongs to current period
    const record = await prisma.monev_records.findFirst({
        where: {
            record_id: recordId,
            period_id: period.period_id
        }
    });

    if (!record) {
        throw new Error('Record tidak ditemukan atau tidak dapat dihapus (bukan periode saat ini)');
    }

    // Check if record is already verified
    if (record.status === recordStatus.Verified) {
        throw new Error('Record yang sudah diverifikasi tidak dapat dihapus');
    }

    await prisma.monev_records.delete({
        where: { record_id: recordId }
    });
}

// Get past records using transaction
async function getPastRecords(userId: UUID): Promise<PastRecordsResponse> {
    const periods = await prisma.monev_periods.findMany({
        where: { user_id: userId },
        include: {
            monev_records: {
                orderBy: { created_at: 'desc' }
            }
        },
        orderBy: { semester: 'desc' }
    });

    // Get current semester to exclude current period
    const userInfo = await prisma.user_information.findUnique({
        where: { user_id: userId },
        select: { semester: true }
    });

    const currentSemester = userInfo ? parseInt(userInfo.semester) : 0;

    const pastPeriods = periods
        .filter(period => period.semester < currentSemester)
        .map(period => ({
            period_id: period.period_id as UUID,
            semester: period.semester,
            status: period.status,
            general_feedback: period.general_feedback ?? undefined,
            created_at: period.created_at,
            updated_at: period.updated_at,
            records: period.monev_records.map(record => ({
                record_id: record.record_id as UUID,
                category: record.category,
                title: record.title,
                description: record.description ?? '',
                file_url: record.file_url,
                grade_value: record.grade_value ?? undefined,
                status: record.status,
                reviewer_notes: record.reviewer_notes ?? undefined,
                verified_by: record.verified_by as UUID | undefined,
                verified_at: record.verified_at ?? undefined,
                created_at: record.created_at,
                updated_at: record.updated_at,
            }))
        }));

    return { periods: pastPeriods };
}

export {
    addMonevRecord,
    addBulkMonevRecords,
    getCurrentPeriodRecords,
    updateMonevRecord,
    deleteMonevRecord,
    getPastRecords
};