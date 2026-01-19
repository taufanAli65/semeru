import { userRole, userStatus } from "@prisma/client";

interface userInformation {
    name: string
    nim: string
    nomor_whatsapp: string
    program_studi: string
    fakultas: string
    semester: string
    universitas: string
    status: userStatus
}

export interface user {
    user_id: string;
    email: string;
    roles: userRole[];
    information: userInformation;
}

export interface updateUserInfo {
    name?: string
    nim?: string
    nomor_whatsapp?: string
    program_studi?: string
    fakultas?: string
    semester?: string
    universitas?: string
}