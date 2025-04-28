import { Controller, Get, Param } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  @SkipAuth()
  async getAllStories() {
    return this.storiesService.getAllStories();
  }

  @Get(':storyId')
  @SkipAuth()
  async getStoryById(@Param('storyId') storyId: string) {
    return this.storiesService.getStoryById(storyId);
  }
}
