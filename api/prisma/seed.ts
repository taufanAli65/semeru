import bcrypt from 'bcryptjs';
import { PrismaClient, userRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../src/config/index.config';

const connectionString = DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = process.env.SEEDER_PASSWORD;
  if (!password) {
    throw new Error('SEEDER_PASSWORD is not set');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const email = 'superadmin@semeru.web.id';

  await prisma.users.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: userRole.SuperAdmin,
    },
    create: {
      email,
      password: hashedPassword,
      role: userRole.SuperAdmin,
    },
  });

  console.log('SuperAdmin account seeded');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });