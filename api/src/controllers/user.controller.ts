import { Request, Response } from 'express';
import { prisma } from '../config/prisma.config';
import { userRole } from '@prisma/client';
import { validate } from '../helpers/validator.helper';
import { z } from 'zod';

// Validators
const updateUserRolesSchema = z.object({
    roles: z.array(z.nativeEnum(userRole))
});

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string | undefined;
        const skip = (page - 1) * limit;

        const whereClause = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' as const } },
                { user_information: { name: { contains: search, mode: 'insensitive' as const } } }
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.users.findMany({
                where: whereClause,
                select: {
                    user_id: true,
                    email: true,
                    roles: true,
                    created_at: true,
                    user_information: {
                        select: {
                            name: true,
                            nim: true,
                            program_studi: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            }),
            prisma.users.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_items: total,
                    items_per_page: limit
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal mengambil data pengguna'
        });
    }
};

// Update user roles
export const updateUserRoles = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { roles } = validate(updateUserRolesSchema, req.body);

        // Prevent modifying own roles to avoid lockout
        if (req.user?.user_id === id) {
            return res.status(400).json({
                success: false,
                message: 'Anda tidak dapat mengubah role Anda sendiri'
            });
        }

        const updatedUser = await prisma.users.update({
            where: { user_id: id },
            data: { roles },
            select: {
                user_id: true,
                email: true,
                roles: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Role pengguna berhasil diperbarui',
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Gagal memperbarui role pengguna'
        });
    }
};
