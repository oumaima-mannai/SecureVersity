import { Controller, Get, Post, Body } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Get('default')
  findDefault() {
    return this.templatesService.findDefault();
  }

  @Post()
  create(@Body() data: any) {
    return this.templatesService.create(data);
  }
}
