import { Controller, Post, Body, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post('answers')
  saveAnswer(@Body() body: { sectionId: string; questionId: string; value: any; userId?: string }) {
    return this.responsesService.saveAnswer(body.sectionId, body.questionId, body.value, body.userId);
  }

  @Post('sections/:id/submit')
  submit(@Param('id') id: string) {
    return this.responsesService.submitSection(id);
  }

  @Post('sections/:id/validate')
  validate(@Param('id') id: string, @Body('approve') approve: boolean) {
    return this.responsesService.validateSection(id, approve);
  }
}
