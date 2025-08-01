import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BriefsService } from './briefs.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BriefCreateDto } from './interface/brief.create-model';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('briefs')
export class BriefsController {
  constructor(private readonly briefsService: BriefsService) {}

  @Get()
  @SkipAuth()
  findAll() {
    return this.briefsService.findAll();
  }

  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.briefsService.findOne(id);
  }

  @Post()
  create(
    @Body() briefCreateDto: BriefCreateDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.briefsService.createBrief(briefCreateDto, user.id);
  }
}
