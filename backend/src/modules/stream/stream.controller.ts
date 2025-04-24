import { Controller, Param, Post, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  // todo - remove SkipAuth once well tested
  @SkipAuth()
  @Post('story/:storyId')
  async getStoryStream(@Param('storyId') storyId: string, @Res() res: Response) {
    res.header('Content-Type', 'application/vnd.apple.mpegurl');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate, public, max-age=2');
    const playlistPath = await this.streamService.getStoryPlaylistFile(storyId);
    const fileStream = createReadStream(playlistPath);
    fileStream.pipe(res);
  }
}
