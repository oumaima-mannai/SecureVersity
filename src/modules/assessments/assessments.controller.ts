import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  createFromTemplate(@Body() body: { templateId: string; creatorId: string; name?: string }) {
    return this.assessmentsService.createFromTemplate(body.templateId, body.creatorId, body.name);
  }

  @Get()
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Put('sections/:sectionId/assign')
  assign(@Param('sectionId') sectionId: string, @Body('userId') userId: string) {
    return this.assessmentsService.assignSection(sectionId, userId);
  }
}
