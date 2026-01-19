import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  nim: z.string().min(1, 'NIM is required').max(20, 'NIM must be less than 20 characters'),
  nomor_whatsapp: z.string().min(10, 'WhatsApp number must be at least 10 characters').max(15, 'WhatsApp number must be less than 15 characters'),
  program_studi: z.string().min(1, 'Program Studi is required').max(100, 'Program Studi must be less than 100 characters'),
  fakultas: z.string().min(1, 'Fakultas is required').max(100, 'Fakultas must be less than 100 characters'),
  semester: z.string().min(1, 'Semester is required').max(10, 'Semester must be less than 10 characters'),
  universitas: z.string().min(1, 'Universitas is required').max(100, 'Universitas must be less than 100 characters'),
});

export const updateUserInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  nim: z.string().min(1, 'NIM is required').max(20, 'NIM must be less than 20 characters').optional(),
  nomor_whatsapp: z.string().min(10, 'WhatsApp number must be at least 10 characters').max(15, 'WhatsApp number must be less than 15 characters').optional(),
  program_studi: z.string().min(1, 'Program Studi is required').max(100, 'Program Studi must be less than 100 characters').optional(),
  fakultas: z.string().min(1, 'Fakultas is required').max(100, 'Fakultas must be less than 100 characters').optional(),
  semester: z.string().min(1, 'Semester is required').max(10, 'Semester must be less than 10 characters').optional(),
  universitas: z.string().min(1, 'Universitas is required').max(100, 'Universitas must be less than 100 characters').optional(),
});

export const userIdSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const roleSchema = z.object({
  role: z.enum(['SuperAdmin', 'Admin', 'Mahasiswa', 'Mentor']),
});

export const userRolesSchema = z.object({
  roles: z.array(z.enum(['SuperAdmin', 'Admin', 'Mahasiswa', 'Mentor'])),
});