import { Request, Response } from 'express';
import { assignMenteesToMentor, menteeList, approveMenteeProgress, listMenteeMonevRecords, getMonevRecordById } from '../../services/jejak/mentor.service';
import { validate } from '../../helpers/validator.helper';
import mentorValidator, { assignMenteesBody, menteeListQuery, approveMonevBody } from '../../validators/jejak/mentor.validator';
import { recordStatus, periodStatus } from '@prisma/client';
import { UUID } from 'node:crypto';

export const assignMenteesController = async (req: Request, res: Response) => {
	try {
		const { mentorId } = validate(mentorValidator.mentorIdParam, req.params);
		const { userIds, semester } = validate(assignMenteesBody, req.body);

		await assignMenteesToMentor(mentorId as UUID, userIds as UUID[], semester as number);

		res.status(201).json({ success: true, message: 'Mahasiswa berhasil ditugaskan ke mentor' });
	} catch (error) {
		res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Gagal menugaskan mahasiswa ke mentor' });
	}
};

export const getMenteeListController = async (req: Request, res: Response) => {
	try {
		const { mentorId } = validate(mentorValidator.mentorIdParam, req.params);
		const { semester, status, page, limit } = validate(menteeListQuery, req.query);

		let statusFilter: periodStatus | undefined;
		if (status === 'Complete') statusFilter = periodStatus.Complete;
		else if (status === 'Incomplete') statusFilter = periodStatus.Incomplete;

		const { items, meta } = await menteeList(mentorId as UUID, semester as number | undefined, statusFilter, page ?? 1, limit ?? 20);

		res.status(200).json({ success: true, data: items, meta });
	} catch (error) {
		res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Gagal mengambil daftar mahasiswa' });
	}
};

export const approveMenteeProgressController = async (req: Request, res: Response) => {
	try {
		const { record_id } = validate(mentorValidator.recordIdParam, req.params);
		const { status, notes } = validate(approveMonevBody, req.body);

		await approveMenteeProgress(record_id as UUID, status as recordStatus, notes as string | undefined);

		res.status(200).json({ success: true, message: 'Record monev berhasil diperbarui' });
	} catch (error) {
		if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
			return res.status(404).json({ success: false, message: error.message });
		}
		res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Persetujuan gagal' });
	}
};

export const listMonevRecordsController = async (req: Request, res: Response) => {
	try {
        const { period_id } = validate(mentorValidator.periodIdParam, req.params);

		const records = await listMenteeMonevRecords(period_id as UUID);

		res.status(200).json({ success: true, data: records });
	} catch (error) {
		res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Gagal mengambil record' });
	}
};

export const getMonevRecordController = async (req: Request, res: Response) => {
	try {
		const { record_id } = validate(mentorValidator.recordIdParam, req.params);

		const record = await getMonevRecordById(record_id as UUID);

		res.status(200).json({ success: true, data: record });
	} catch (error) {
		if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
			return res.status(404).json({ success: false, message: error.message });
		}
		res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Gagal mengambil record' });
	}
};
