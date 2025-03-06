import { Controller, Get, Param, Res } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Response } from 'express';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { AudioGenerationService } from '../audio-generation/audio-generation.service';

@Controller('stories')
export class StoriesController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  @Get()
  async getAllStories() {
    return this.storiesService.getAllStories();
  }

  @Get(':storyId')
  async getStoryById(@Param('storyId') storyId: string) {
    return this.storiesService.getStoryById(storyId);
  }

  // for debug
  @SkipAuth()
  @Get(':storyId/stream')
  streamStoryById(@Param('storyId') storyId: string, @Res() res: Response) {
    const files = this.audioGenerationService.generateSpeech(
      'Lorem ipsunm dolor. Lorem ipsum dolor sit amet',
    );

    res.setHeader('Content-Type', 'audio/wav');
  }
}
