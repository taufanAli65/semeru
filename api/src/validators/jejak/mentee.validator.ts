import { z } from 'zod';
import { monevCategory } from '@prisma/client';

export const recordIdParam = z.object({
    record_id: z.string().uuid({ message: 'record_id harus berupa UUID yang valid' }),
});

export const createMonevRecordBody = z.object({
    category: z.nativeEnum(monevCategory, { message: 'Kategori tidak valid' }),
    title: z.string().min(1, { message: 'Judul tidak boleh kosong' }).max(255, { message: 'Judul maksimal 255 karakter' }),
    description: z.string().max(1000, { message: 'Deskripsi maksimal 1000 karakter' }).optional(),
    grade_value: z.number().min(0).max(4).optional(),
});

export const bulkCreateMonevRecordBody = z.object({
    records: z.array(createMonevRecordBody).min(1, { message: 'Minimal 1 record harus disertakan' }).max(50, { message: 'Maksimal 50 record per bulk upload' }),
});

export const updateMonevRecordBody = z.object({
    title: z.string().min(1, { message: 'Judul tidak boleh kosong' }).max(255, { message: 'Judul maksimal 255 karakter' }).optional(),
    description: z.string().max(1000, { message: 'Deskripsi maksimal 1000 karakter' }).optional(),
    grade_value: z.number().min(0).max(4).optional(),
});

export type CreateMonevRecordBody = z.infer<typeof createMonevRecordBody>;
export type BulkCreateMonevRecordBody = z.infer<typeof bulkCreateMonevRecordBody>;
export type UpdateMonevRecordBody = z.infer<typeof updateMonevRecordBody>;