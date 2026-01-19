import { z } from "zod";
import { userRole } from "@prisma/client";

export const updateUserRolesSchema = z.object({
    roles: z.array(z.nativeEnum(userRole))
});