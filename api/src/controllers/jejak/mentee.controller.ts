import { Request, Response } from 'express';
import {
    addMonevRecord,
    addBulkMonevRecords,
    getCurrentPeriodRecords,
    updateMonevRecord,
    deleteMonevRecord,
    getPastRecords
} from '../../services/jejak/mentee.service';
import { validate } from '../../helpers/validator.helper';
import {
    createMonevRecordBody,
    bulkCreateMonevRecordBody,
    updateMonevRecordBody,
    recordIdParam
} from '../../validators/jejak/mentee.validator';
import { UUID } from 'node:crypto';
import { uploadFileToStorage, deleteFileFromStorage } from '../../utils/fileUpload.utils';
import { prisma } from '../../config/prisma.config';

// Add single monev record
export const addMonevRecordController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const { category, title, description, grade_value } = validate(createMonevRecordBody, req.body);

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File wajib diupload' });
        }

        // Get user's current semester
        const userInfo = await prisma.user_information.findUnique({
            where: { user_id: userId },
            select: { semester: true }
        });

        if (!userInfo) {
            return res.status(404).json({ success: false, message: 'Informasi pengguna tidak ditemukan' });
        }

        // Upload file to storage
        const fileUrl = await uploadFileToStorage(
            req.file,
            userId,
            userInfo.semester,
            category
        );

        const record = await addMonevRecord(userId, {
            category,
            title,
            description,
            file_url: fileUrl,
            grade_value
        });

        res.status(201).json({
            success: true,
            message: 'Record monev berhasil ditambahkan',
            data: record
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal menambahkan record monev'
        });
    }
};

// Add bulk monev records
export const addBulkMonevRecordsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const { records } = validate(bulkCreateMonevRecordBody, req.body);

        // Check if files were uploaded
        const files = req.files as Express.Multer.File[];
        if (!files || files.length !== records.length) {
            return res.status(400).json({
                success: false,
                message: `Jumlah file (${files?.length || 0}) tidak sesuai dengan jumlah record (${records.length})`
            });
        }

        // Get user's current semester
        const userInfo = await prisma.user_information.findUnique({
            where: { user_id: userId },
            select: { semester: true }
        });

        if (!userInfo) {
            return res.status(404).json({ success: false, message: 'Informasi pengguna tidak ditemukan' });
        }

        // Process each record with its file
        const recordsWithFiles = [];
        for (let i = 0; i < records.length; i++) {
            const fileUrl = await uploadFileToStorage(
                files[i],
                userId,
                userInfo.semester,
                records[i].category
            );

            recordsWithFiles.push({
                ...records[i],
                file_url: fileUrl
            });
        }

        const createdRecords = await addBulkMonevRecords(userId, { records: recordsWithFiles });

        res.status(201).json({
            success: true,
            message: `${createdRecords.length} record monev berhasil ditambahkan`,
            data: createdRecords
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal menambahkan bulk record monev'
        });
    }
};

// Get current period records
export const getCurrentPeriodRecordsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const currentPeriodData = await getCurrentPeriodRecords(userId);

        if (!currentPeriodData) {
            return res.status(404).json({
                success: false,
                message: 'Periode monev saat ini tidak ditemukan. Silakan hubungi mentor Anda.'
            });
        }

        res.status(200).json({
            success: true,
            data: currentPeriodData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal mengambil record periode saat ini'
        });
    }
};

// Update monev record
export const updateMonevRecordController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const { record_id } = validate(recordIdParam, req.params) as { record_id: string };
        const updateData = validate(updateMonevRecordBody, req.body);

        // Get user's current semester for file upload
        const userInfo = await prisma.user_information.findUnique({
            where: { user_id: userId },
            select: { semester: true }
        });

        if (!userInfo) {
            return res.status(404).json({ success: false, message: 'Informasi pengguna tidak ditemukan' });
        }

        // Get existing record to potentially delete old file
        const existingRecord = await prisma.monev_records.findUnique({
            where: { record_id: record_id as UUID },
            select: { file_url: true, category: true }
        });

        let fileUrl: string | undefined = undefined;

        // If new file is uploaded, upload it and delete old file
        if (req.file) {
            fileUrl = await uploadFileToStorage(
                req.file,
                userId,
                userInfo.semester,
                existingRecord?.category || 'Unknown'
            );

            // Delete old file if it exists
            if (existingRecord?.file_url) {
                await deleteFileFromStorage(existingRecord.file_url);
            }
        }

        const updatedRecord = await updateMonevRecord(userId, record_id as UUID, {
            ...updateData,
            ...(fileUrl && { file_url: fileUrl })
        });

        res.status(200).json({
            success: true,
            message: 'Record monev berhasil diperbarui',
            data: updatedRecord
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal memperbarui record monev'
        });
    }
};

// Delete monev record
export const deleteMonevRecordController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const { record_id } = validate(recordIdParam, req.params) as { record_id: string };

        // Get the record to delete the file
        const record = await prisma.monev_records.findUnique({
            where: { record_id: record_id as UUID },
            select: { file_url: true }
        });

        await deleteMonevRecord(userId, record_id as UUID);

        // Delete the file from storage
        if (record?.file_url) {
            await deleteFileFromStorage(record.file_url);
        }

        res.status(200).json({
            success: true,
            message: 'Record monev berhasil dihapus'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal menghapus record monev'
        });
    }
};

// Get past records
export const getPastRecordsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id as UUID;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi' });
        }

        const pastRecords = await getPastRecords(userId);

        res.status(200).json({
            success: true,
            data: pastRecords
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal mengambil record masa lalu'
        });
    }
};