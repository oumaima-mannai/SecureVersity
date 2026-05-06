import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class TemplatesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultTemplate();
  }

  async seedDefaultTemplate() {
    const existing = await this.prisma.template.findFirst({
      where: { is_default: true },
    });

    if (existing) return;

    // Create Default ISO 27001 Template
    const template = await this.prisma.template.create({
      data: {
        name: 'ISO/IEC 27001 Context Assessment',
        description: 'Standard template for analyzing the context of the organization and ISMS scope.',
        is_default: true,
        sections: {
          create: [
            {
              title: 'Context of the Organization (Clause 4)',
              description: 'Define internal/external issues and stakeholders.',
              order_index: 1,
              role_required: Role.DIRECTION,
              questions: {
                create: [
                  {
                    question_text: 'Have the external and internal issues relevant to the ISMS been determined?',
                    type: 'YES_NO',
                    required: true,
                    order_index: 1,
                  },
                  {
                    question_text: 'List the key external factors affecting your information security.',
                    type: 'TEXTAREA',
                    required: false,
                    order_index: 2,
                  },
                ],
              },
            },
            {
              title: 'Information Security Policies (A.5)',
              description: 'Direction and support for information security.',
              order_index: 2,
              role_required: Role.RSSI,
              questions: {
                create: [
                  {
                    question_text: 'Is there a published information security policy?',
                    type: 'YES_NO',
                    required: true,
                    order_index: 1,
                  },
                  {
                    question_text: 'How often are the policies reviewed?',
                    type: 'SELECT',
                    options: ['Monthly', 'Quarterly', 'Annually', 'Never'],
                    required: true,
                    order_index: 2,
                  },
                ],
              },
            },
            {
              title: 'Asset Management (A.8)',
              description: 'Identify and protect organizational assets.',
              order_index: 3,
              role_required: Role.EMPLOYEE_IT,
              questions: {
                create: [
                  {
                    question_text: 'Are all major information assets inventoried?',
                    type: 'YES_NO',
                    required: true,
                    order_index: 1,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });

    console.log('✅ Default ISO 27001 Template seeded:', template.name);
  }

  async findAll() {
    return this.prisma.template.findMany({
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  async findDefault() {
    return this.prisma.template.findFirst({
      where: { is_default: true },
      include: {
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.template.create({ data });
  }
}
