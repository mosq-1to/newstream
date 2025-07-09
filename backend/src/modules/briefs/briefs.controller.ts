import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BriefsService } from './briefs.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BriefCreateDto } from './interface/brief.create-model';

@Controller('briefs')
@SkipAuth()
export class BriefsController {
  constructor(private readonly briefsService: BriefsService) {}

  @Get()
  findAll() {
    return this.briefsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.briefsService.findOne(id);
  }

  @Post()
  create(@Body() briefCreateDto: BriefCreateDto) {
    return this.briefsService.createBrief(briefCreateDto);
  }
}
