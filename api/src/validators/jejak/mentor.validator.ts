import { z } from 'zod';

export const mentorIdParam = z.object({
	mentorId: z.string().uuid({ message: 'mentorId must be a valid UUID' }),
});

export const periodIdParam = z.object({
	period_id: z.string().uuid({ message: 'period_id must be a valid UUID' }),
});

export const recordIdParam = z.object({
	record_id: z.string().uuid({ message: 'record_id must be a valid UUID' }),
});

export const assignMenteesBody = z.object({
	userIds: z.array(z.string().uuid()).nonempty({ message: 'userIds must contain at least one UUID' }),
	semester: z.number().int().positive({ message: 'semester must be a positive integer' }),
});

export const semesterQuery = z.object({
	semester: z.preprocess((val) => {
		if (typeof val === 'string' && val.trim() !== '') return Number(val);
		return val;
	}, z.number().int().positive({ message: 'semester must be a positive integer' })),
});

export const menteeListQuery = z.object({
	semester: z.preprocess((val) => {
		if (typeof val === 'string' && val.trim() !== '') return Number(val);
		return val;
	}, z.number().int().positive().optional()),
	status: z.enum(['Complete', 'Incomplete']).optional(),
	page: z.preprocess((val) => {
		if (typeof val === 'string' && val.trim() !== '') return Number(val);
		return val;
	}, z.number().int().positive().optional()),
	limit: z.preprocess((val) => {
		if (typeof val === 'string' && val.trim() !== '') return Number(val);
		return val;
	}, z.number().int().positive().optional()),
});

export const approveMonevBody = z.object({
	status: z.enum(['Pending', 'Verified', 'Fail']),
	notes: z.string().max(2000).optional(),
});

export type AssignMenteesBody = z.infer<typeof assignMenteesBody>;
export type SemesterQuery = z.infer<typeof semesterQuery>;
export type MenteeListQuery = z.infer<typeof menteeListQuery>;
export type ApproveMonevBody = z.infer<typeof approveMonevBody>;
export type MentorIdParam = z.infer<typeof mentorIdParam>;
export type PeriodIdParam = z.infer<typeof periodIdParam>;
export type RecordIdParam = z.infer<typeof recordIdParam>;

export const recordStatusEnum = ['Pending', 'Verified', 'Fail'] as const;

export default {
	mentorIdParam,
	periodIdParam,
	recordIdParam,
	assignMenteesBody,
		semesterQuery,
		menteeListQuery,
	approveMonevBody,
};

