import { Controller, Get, Param, Res } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Response } from 'express';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { createReadStream } from 'fs';

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

  // todo - remove SkipAuth once well tested
  @SkipAuth()
  @Get(':storyId/stream')
  async streamStoryById(
    @Param('storyId') storyId: string,
    @Res() res: Response,
  ) {
    res.header('Content-Type', 'application/vnd.apple.mpegurl');
    res.header(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, public, max-age=2',
    );

    const playlistPath =
      await this.storiesService.getPlaylistPathByStoryId(storyId);
    const fileStream = createReadStream(playlistPath);
    fileStream.pipe(res);
  }

  @SkipAuth()
  @Get(':storyId/stream/segments/:segmentId')
  async getSegment(
    @Param('storyId') storyId: string,
    @Param('segmentId') segmentId: string,
    @Res() res: Response,
  ) {
    res.header('Content-Type', 'video/mp2t');
    res.header('Cache-Control', 'public, max-age=3600');
    const filePath =
      await this.storiesService.getSegmentFilePathByStoryIdAndSegmentId(
        storyId,
        segmentId,
      );

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
