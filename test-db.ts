import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in DB:', users.length);
  if (users.length > 0) console.log('First User:', users[0].id, users[0].email);

  const templates = await prisma.template.findMany();
  console.log('Templates in DB:', templates.length);
  if (templates.length > 0) console.log('First Template:', templates[0].id, templates[0].name);

  if (users.length > 0 && templates.length > 0) {
    try {
      const assessment = await prisma.assessment.create({
        data: {
          name: 'Manual Test Assessment',
          template_id: templates[0].id,
          created_by: users[0].id,
          status: 'IN_PROGRESS'
        }
      });
      console.log('Assessment created successfully:', assessment.id);
    } catch (e) {
      console.error('Failed to create Assessment:', e);
    }
  } else {
    console.log('Cannot test creation, missing user or template');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
