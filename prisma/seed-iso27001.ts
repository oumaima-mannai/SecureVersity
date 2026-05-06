import { PrismaClient, Role } from '@prisma/client';
import { ISO27001_EN } from './iso27001-data-en';

const prisma = new PrismaClient();

async function seed() {
  // --- CLEANUP ---
  console.log('🧹 Cleaning old seeded data...');
  await prisma.assessment.deleteMany({ where: { name: 'Evaluation Officielle ISO 27001:2022' } });
  await prisma.template.deleteMany({ where: { name: 'ISO/IEC 27001:2022 Full Audit' } });
  console.log('✅ Old data removed.\n');

  // 1. Create Master Template
  const template = await prisma.template.create({
    data: {
      name: 'ISO/IEC 27001:2022 Full Audit',
      description: 'Complete ISO 27001:2022 audit template — all roles and clauses.',
      is_default: false,
    },
  });
  console.log(`✅ Created Template: ${template.name}\n`);

  let sectionOrder = 1;

  for (const section of ISO27001_EN) {
    const role = section.role as Role;

    if (!Object.values(Role).includes(role)) {
      console.log(`⚠️  Unknown role: ${section.role}, skipping...`);
      continue;
    }

    const createdSection = await prisma.sectionTemplate.create({
      data: {
        template_id: template.id,
        title: section.clauseCode,
        description: `ISO 27001:2022 requirements — Role: ${role}`,
        order_index: section.order,   // ← explicit clause-based order
        role_required: role,
      },
    });

    console.log(`📁 [${role}] ${createdSection.title}`);

    await prisma.questionTemplate.createMany({
      data: section.questions.map((q, idx) => ({
        section_id: createdSection.id,
        question_text: q,
        type: 'SELECT' as const,
        options: ['Compliant (C)', 'Partially Compliant (PC)', 'Non-Compliant (NC)', 'Not Applicable (NA)'],
        required: true,
        order_index: idx + 1,
      })),
    });

    console.log(`   -> 📝 ${section.questions.length} questions inserted`);
  }

  // 2. Create official Assessment
  console.log('\n🔗 Creating official Assessment...');
  const adminUser = await prisma.user.findFirst();

  if (!adminUser) {
    console.log('⚠️  No user found — skipping Assessment creation. Run seed-users.ts first.');
    return;
  }

  const fullTemplate = await prisma.template.findFirst({
    where: { name: 'ISO/IEC 27001:2022 Full Audit' },
    include: { sections: true },
  });

  const assessment = await prisma.assessment.create({
    data: {
      name: 'Evaluation Officielle ISO 27001:2022',
      template_id: fullTemplate!.id,
      status: 'DRAFT',
      created_by: adminUser.id,
    },
  });

  await prisma.assessmentSection.createMany({
    data: fullTemplate!.sections.map((s) => ({
      assessment_id: assessment.id,
      section_template_id: s.id,
      status: 'NOT_STARTED' as const,
    })),
  });

  const totalQ = ISO27001_EN.reduce((sum, s) => sum + s.questions.length, 0);
  console.log(`✅ Assessment created with ${fullTemplate!.sections.length} sections.`);
  console.log(`\n🚀 Done! ${totalQ} English questions seeded across ${fullTemplate!.sections.length} sections.`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
