import { UUID } from 'node:crypto';
import { prisma } from '../../config/prisma.config';
import { MenteeList, MonevRecord, MonevRecords } from '../../types/jejak/mentor.type';
import { recordStatus, periodStatus, monevCategory } from '@prisma/client';

async function assignMenteesToMentor(mentorId: UUID, userIds: UUID[], semester: number): Promise<void> {
    await prisma.monev_periods.createMany({
        data: userIds.map(userId => ({
            mentor: mentorId,
            user_id: userId,
            semester: semester,
        })),
        skipDuplicates: true,
    });
}

async function menteeList(
    mentorId: UUID,
    semester?: number,
    status?: periodStatus,
    page = 1,
    limit = 20,
): Promise<{ items: MenteeList[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const where: any = { mentor: mentorId };
    if (semester !== undefined) where.semester = semester;
    if (status !== undefined) where.status = status;

    const total = await prisma.monev_periods.count({ where });

    const records = await prisma.monev_periods.findMany({
        where,
        select: {
            user_id: true,
            period_id: true,
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });

    const items = records.map(r => ({ user_id: r.user_id as UUID, period_id: r.period_id as UUID }));
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { items, meta: { total, page, limit, totalPages } };
}

async function approveMenteeProgress(record_id: UUID, status: recordStatus, notes?: string): Promise<void> {
    // Update the record status
    const updatedRecord = await prisma.monev_records.update({
        where: { record_id },
        data: {
            status,
            ...(notes !== undefined && { reviewer_notes: notes }),
            ...(status === recordStatus.Verified && { verified_at: new Date() })
        },
        include: {
            period: {
                include: {
                    monev_records: true
                }
            }
        }
    });

    // Check if all categories have at least one verified record
    const period = updatedRecord.period;
    const allCategories = Object.values(monevCategory);
    const verifiedCategories = new Set(
        period.monev_records
            .filter(record => record.status === recordStatus.Verified)
            .map(record => record.category)
    );

    // If all categories have verified records, mark period as complete
    const hasAllCategories = allCategories.every(category => verifiedCategories.has(category));

    if (hasAllCategories && period.status === periodStatus.Incomplete) {
        await prisma.monev_periods.update({
            where: { period_id: period.period_id },
            data: { status: periodStatus.Complete }
        });
    }
}

async function listMenteeMonevRecords(period_id: UUID): Promise<MonevRecords> {
    const recordsRaw = await prisma.monev_records.findMany({
        where: { period_id },
        orderBy: { created_at: 'desc' },
    });
    const records = recordsRaw.map(record => ({
        record_id: record.record_id as UUID,
        category: record.category,
        title: record.title,
        description: record.description ?? '',
        file_url: record.file_url,
        status: record.status,
        reviewer_notes: record.reviewer_notes ?? undefined,
        created_at: record.created_at,
        updated_at: record.updated_at,
    }));
    return { period_id, records };
}

async function getMonevRecordById(record_id: UUID): Promise<MonevRecord> {
    const record = await prisma.monev_records.findUnique({
        where: { record_id },
    });
    if (!record) {
        throw new Error("Monev record not found");
    }
    return {
        record_id: record.record_id as UUID,
        category: record.category,
        title: record.title,
        description: record.description ?? '',
        file_url: record.file_url,
        status: record.status,
        reviewer_notes: record.reviewer_notes ?? undefined,
        created_at: record.created_at,
        updated_at: record.updated_at,
    };
}

export { assignMenteesToMentor, menteeList, approveMenteeProgress, listMenteeMonevRecords, getMonevRecordById };