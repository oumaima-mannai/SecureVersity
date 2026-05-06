import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo users...');
  
  const users = [
    { email: 'rssi@secure.com', fullName: 'Alice RSSI', role: Role.RSSI },
    { email: 'it@secure.com', fullName: 'Carlos IT', role: Role.EMPLOYEE_IT },
    { email: 'director@secure.com', fullName: 'Diana Director', role: Role.DIRECTION },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password: 'hashed_password_here', // In real app, hash this
        mustChangePassword: false,
      },
    });
  }

  console.log('✅ Demo users seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
