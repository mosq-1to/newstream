import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { TopicWriteDto } from './interface/topic-write.dto';

@Controller('topics')
@SkipAuth()
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) { }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Post()
  create(@Body() createTopicDto: TopicWriteDto) {
    return this.topicsService.createTopic(createTopicDto);
  }
}
