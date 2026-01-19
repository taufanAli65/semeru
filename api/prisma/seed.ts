import bcrypt from 'bcryptjs';
import { PrismaClient, userRole, userStatus } from '@prisma/client';
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
      roles: [userRole.SuperAdmin],
    },
    create: {
      email,
      password: hashedPassword,
      roles: [userRole.SuperAdmin],
    },
  });

  // Get the created user to get user_id
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (user) {
    await prisma.user_information.upsert({
      where: { user_id: user.user_id },
      update: {
        name: "Super Admin",
        nim: "00000000",
        nomor_whatsapp: "+6281234567890",
        program_studi: "superAdmin",
        fakultas: "superAdmin",
        semester: "1",
        universitas: "superAdmin",
        status: userStatus.Active,
      },
      create: {
        user_id: user.user_id,
        name: "Super Admin",
        nim: "00000000",
        nomor_whatsapp: "+6281234567890",
        program_studi: "superAdmin",
        fakultas: "superAdmin",
        semester: "1",
        universitas: "superAdmin",
        status: userStatus.Active,
      },
    });
  }

  console.log('SuperAdmin account and information seeded');
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });