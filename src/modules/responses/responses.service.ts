import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SectionStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ResponsesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async saveAnswer(sectionId: string, questionId: string, value: any, userId?: string) {
    // 1. Verify existence
    const section = await this.prisma.assessmentSection.findUnique({
      where: { id: sectionId },
    });
    if (!section) throw new NotFoundException('Section not found');

    // 2. Upsert (Save or Update) based on section and question
    const existing = await this.prisma.answer.findFirst({
      where: {
        assessment_section_id: sectionId,
        question_template_id: questionId,
      },
    });

    if (existing) {
      return this.prisma.answer.update({
        where: { id: existing.id },
        data: { value, answered_by: userId },
      });
    } else {
      return this.prisma.answer.create({
        data: {
          assessment_section_id: sectionId,
          question_template_id: questionId,
          value,
          answered_by: userId,
        },
      });
    }
  }

  async submitSection(sectionId: string) {
    const updated = await this.prisma.assessmentSection.update({
      where: { id: sectionId },
      data: { status: SectionStatus.SUBMITTED },
      include: { sectionTemplate: true, assignee: true }
    });

    // Notify the RSSI / ADMIN
    const admins = await this.prisma.user.findMany({
      where: { role: { in: ['RSSI', 'ADMIN_SYSTEM'] } }
    });

    for (const admin of admins) {
      await this.notificationsService.sendNotification(
        admin.id,
        'Section Submitted',
        `${updated.assignee?.fullName || 'A user'} has submitted section: ${updated.sectionTemplate.title} for validation.`
      );
    }

    return updated;
  }

  async validateSection(sectionId: string, approve: boolean) {
    const updated = await this.prisma.assessmentSection.update({
      where: { id: sectionId },
      data: {
        status: approve ? SectionStatus.VALIDATED : SectionStatus.IN_PROGRESS,
      },
      include: { sectionTemplate: true }
    });

    if (updated.assigned_to) {
      await this.notificationsService.sendNotification(
        updated.assigned_to,
        approve ? 'Section Approved' : 'Section Rejected',
        approve 
          ? `Your answers for ${updated.sectionTemplate.title} have been approved.` 
          : `Your answers for ${updated.sectionTemplate.title} were rejected. Please review them.`
      );
    }

    return updated;
  }
}
