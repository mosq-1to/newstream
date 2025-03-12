import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Response } from 'express';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async getAllStories() {
    return this.storiesService.getAllStories();
  }

  @Get(':storyId')
  async getStoryById(@Param('storyId') storyId: string) {
    return this.storiesService.getStoryById(storyId);
  }

  @SkipAuth()
  @Get(':storyId/stream')
  @Header('Content-Type', 'audio/wav')
  @Header('Content-Disposition', 'inline; filename="stream.wav"')
  async streamStoryById(
    @Param('storyId') storyId: string,
    @Res() res: Response,
  ) {
    const audioStream = await this.storiesService.streamStoryById(storyId);
    audioStream.pipe(res);
  }
}
