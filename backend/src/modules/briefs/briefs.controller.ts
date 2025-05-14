import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { BriefsService } from './briefs.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@Controller('briefs')
@SkipAuth()
export class BriefsController {
  constructor(private readonly briefsService: BriefsService) { }

  @Get()
  findAll() {
    return this.briefsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.briefsService.findOne(id);
  }

  @Post()
  create(@Body() createBriefDto: { articleIds: string[]; topicId: string }) {
    return this.briefsService.createBrief(createBriefDto.articleIds, createBriefDto.topicId);
  }
}
