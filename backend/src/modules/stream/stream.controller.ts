import { Controller, Get, Param, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  // todo - remove SkipAuth once well tested
  @SkipAuth()
  @Get('story/:storyId/playlist.m3u8')
  async getStoryStream(@Param('storyId') storyId: string, @Res() res: Response) {
    res.header('Content-Type', 'application/vnd.apple.mpegurl');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate, public, max-age=2');
    const playlistPath = await this.streamService.getStoryPlaylistFile(storyId);
    const fileStream = createReadStream(playlistPath);
    fileStream.pipe(res);
  }

  @SkipAuth()
  @Get('story/:storyId/:segmentFilename')
  async getStorySegment(
    @Param('storyId') storyId: string,
    @Param('segmentFilename') segmentFilename: string,
    @Res() res: Response,
  ) {
    res.header('Content-Type', 'video/mp2t');
    res.header('Cache-Control', 'public, max-age=3600');
    const filePath = await this.streamService.getStorySegmentFile(storyId, segmentFilename);
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
