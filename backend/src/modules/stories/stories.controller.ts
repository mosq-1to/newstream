import { Controller, Get, Param } from '@nestjs/common';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getAllStories() {
    return this.storiesService.getAllStories();
  }

  @Get(':id')
  async getStoryById(@Param('id') id: string) {
    return this.storiesService.getStoryById(id);
  }
}
