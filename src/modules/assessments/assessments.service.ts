import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssessmentStatus, SectionStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async createFromTemplate(templateId: string, creatorId: string, name?: string) {
    // 1. Get the template with its sections
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
      include: {
        sections: true,
      },
    });

    if (!template) throw new NotFoundException('Template not found');

    // 2. Create the Assessment instance
    // Use first available user if creatorId is not a valid UUID (like 'system')
    let finalCreatorId = creatorId;
    if (creatorId === 'system') {
      const firstUser = await this.prisma.user.findFirst();
      if (!firstUser) {
        throw new Error('No valid system user found to create assessment.');
      }
      finalCreatorId = firstUser.id;
    }

    console.log(`[DEBUG] Attempting to create assessment with Template: ${template.id}, Creator: ${finalCreatorId}`);

    let assessment;
    try {
      assessment = await this.prisma.assessment.create({
        data: {
          name: name || `Assessment: ${template.name}`,
          template_id: template.id,
          created_by: finalCreatorId,
          status: AssessmentStatus.IN_PROGRESS,
        },
      });
      console.log(`[DEBUG] Assessment created successfully: ${assessment.id}`);
    } catch (error) {
      console.error(`[DEBUG] Failed to create Assessment:`, error);
      throw error;
    }

    // 3. Create sections and apply auto-assignment logic
    for (const secTemplate of template.sections) {
      // Find a user with the required role to auto-assign
      // For simplicity, we take the first user found with that role
      const potentialAssignee = await this.prisma.user.findFirst({
        where: { role: secTemplate.role_required, isActive: true },
      });

      console.log(`[DEBUG] Creating section for Template Section: ${secTemplate.id}, Assignee: ${potentialAssignee?.id || 'null'}`);
      
      try {
        await this.prisma.assessmentSection.create({
          data: {
            assessment_id: assessment.id,
            section_template_id: secTemplate.id,
            assigned_to: potentialAssignee?.id || null, // Might be null if no user found
            status: SectionStatus.NOT_STARTED,
          },
        });
      } catch (error) {
         console.error(`[DEBUG] Failed to create AssessmentSection:`, error);
      }
    }

    return this.findOne(assessment.id);
  }

  async findOne(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        template: true,
        creator: {
          select: { id: true, email: true, fullName: true, role: true },
        },
        sections: {
          orderBy: {
            sectionTemplate: { order_index: 'asc' },
          },
          include: {
            sectionTemplate: {
              include: { questions: { orderBy: { order_index: 'asc' } } },
            },
            assignee: {
              select: { id: true, email: true, fullName: true, role: true },
            },
            answers: true,
          },
        },
      },
    });

    if (!assessment) throw new NotFoundException('Assessment not found');
    
    // Calculate progress
    const totalSections = assessment.sections.length;
    const completedSections = assessment.sections.filter(
      s => s.status === SectionStatus.VALIDATED || s.status === SectionStatus.SUBMITTED
    ).length;
    
    const globalProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

    return {
      ...assessment,
      globalProgress,
    };
  }

  async findAll() {
    return this.prisma.assessment.findMany({
      include: {
        template: true,
        sections: true,
      },
    });
  }

  async assignSection(sectionId: string, userId: string) {
    const updated = await this.prisma.assessmentSection.update({
      where: { id: sectionId },
      data: { assigned_to: userId },
      include: { sectionTemplate: true }
    });

    // Notify the user
    await this.notificationsService.sendNotification(
      userId,
      'New Assignment',
      `You have been assigned to complete section: ${updated.sectionTemplate.title}`
    );

    return updated;
  }
}
