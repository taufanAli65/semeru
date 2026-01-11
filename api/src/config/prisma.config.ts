import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from './index.config';

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

export const prisma = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;