import { UUID } from "node:crypto";
import { prisma } from "../../config/prisma.config";
import { userRole, userStatus } from "@prisma/client";
import { user, updateUserInfo } from "../../types/authentication.type";
import { hashPassword, comparePassword } from "../../helpers/password.helper";


async function getUserById(userId: string): Promise<user> {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: {
            user_id: true,
            email: true,
            role: true,
            user_information: true,
        },
    });

    if (!user) { throw new Error("User not found"); }
    if (!user.user_information) { throw new Error("User information not found"); }

    return {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        information: user.user_information,
    };
}

async function getAllUsers(user_id: UUID): Promise<user[]> {
    const isSuperAdmin = await prisma.users.findUnique({
        where: { user_id },
        select: {
            role: true,
        },
    });

    if (isSuperAdmin?.role !== userRole.SuperAdmin) {
        throw new Error("Access denied. SuperAdmin role required.");
    }

    const users = await prisma.users.findMany({
        select: {
            user_id: true,
            email: true,
            role: true,
            user_information: true,
        },
    });

    return users.map((u) => {
        if (!u.user_information) {
            throw new Error("User information not found");
        }
        return {
            user_id: u.user_id,
            email: u.email,
            role: u.role,
            information: u.user_information,
        };
    });
}

async function deleteUserById(requesterId: UUID, userIdToDelete: UUID): Promise<void> {
    const requester = await prisma.users.findUnique({
        where: { user_id: requesterId },
        select: {
            role: true,
        },
    });

    if (requester?.role !== userRole.SuperAdmin) {
        throw new Error("Access denied. SuperAdmin role required.");
    }

    const userToDelete = await prisma.users.findUnique({
        where: { user_id: userIdToDelete },
    });

    if (!userToDelete) {
        throw new Error("User not found");
    }

    await prisma.users.delete({
        where: { user_id: userIdToDelete },
    });
}

async function changeUserRole(requesterId: UUID, userIdToChange: UUID, newRole: userRole): Promise<void> {
    const requester = await prisma.users.findUnique({
        where: { user_id: requesterId },
        select: {
            role: true,
        },
    });

    if (requester?.role !== userRole.SuperAdmin) {
        throw new Error("Access denied. SuperAdmin role required.");
    }

    const userToChange = await prisma.users.findUnique({
        where: { user_id: userIdToChange },
    });

    if (!userToChange) {
        throw new Error("User not found");
    }

    await prisma.users.update({
        where: { user_id: userIdToChange },
        data: { role: newRole },
    });
}

async function getUserByRole(user_id: UUID, role: userRole): Promise<user[]> {
    const isSuperAdmin = await prisma.users.findUnique({
        where: { user_id },
        select: {
            role: true,
        },
    });

    if (isSuperAdmin?.role !== userRole.SuperAdmin) {
        throw new Error("Access denied. SuperAdmin role required.");
    }

    const users = await prisma.users.findMany({
        where: { role },
        select: {
            user_id: true,
            email: true,
            role: true,
            user_information: true,
        },
    });

    return users.map((u) => {
        if (!u.user_information) {
            throw new Error("User information not found");
        }
        return {
            user_id: u.user_id,
            email: u.email,
            role: u.role,
            information: u.user_information,
        };
    });
}

async function createUser(email: string, password: string, name: string, nim: string, nomor_whatsapp: string, program_studi: string, fakultas: string, semester: string, universitas: string): Promise<user> {
    const existingUser = await prisma.users.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.users.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole.Mahasiswa,
            },
        });

        const userInfo = await tx.user_information.create({
            data: {
                user_id: newUser.user_id,
                name: name,
                nim: nim,
                nomor_whatsapp: nomor_whatsapp,
                program_studi: program_studi,
                fakultas: fakultas,
                semester: semester,
                universitas: universitas,
                status: userStatus.Active,
            },
        });

        return {
            user_id: newUser.user_id,
            email: newUser.email,
            role: newUser.role,
            information: userInfo,
        };
    });

    return result;
}

async function updateUserInformation(userId: string, updatedInfo: updateUserInfo): Promise<user> {
    const user = await prisma.users.findUnique({
        where: { user_id: userId },
        select: {
            user_id: true,
            email: true,
            role: true,
            user_information: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const updatedUserInfo = await prisma.user_information.update({
        where: { user_id: userId },
        data: updatedInfo,
    });

    return {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        information: updatedUserInfo,
    };
}

async function login(email: string, password: string): Promise<user> {
    const user = await prisma.users.findUnique({
        where: { email },
        select: {
            user_id: true,
            email: true,
            password: true,
            role: true,
            user_information: true,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    if (!user.user_information) {
        throw new Error("User information not found");
    }

    return {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        information: user.user_information,
    };
}

export { getUserById, getAllUsers, deleteUserById, changeUserRole, getUserByRole, createUser, updateUserInformation, login };