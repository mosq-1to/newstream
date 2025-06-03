import { Controller, Get, Param, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) { }

  // todo - remove SkipAuth once well tested

  @SkipAuth()
  @Get('brief/:briefId/playlist.m3u8')
  async getBriefStream(@Param('briefId') briefId: string, @Res() res: Response) {
    console.log('requested to stream briefId', briefId);
    res.header('Content-Type', 'application/vnd.apple.mpegurl');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate, public, max-age=2');
    const playlistPath = await this.streamService.getBriefPlaylistFile(briefId);
    const fileStream = createReadStream(playlistPath);
    fileStream.pipe(res);
  }

  @SkipAuth()
  @Get('brief/:briefId/:segmentFilename')
  async getBriefSegment(
    @Param('briefId') briefId: string,
    @Param('segmentFilename') segmentFilename: string,
    @Res() res: Response,
  ) {
    res.header('Content-Type', 'video/mp2t');
    res.header('Cache-Control', 'public, max-age=3600');
    const filePath = await this.streamService.getBriefSegmentFile(briefId, segmentFilename);
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @SkipAuth()
  @Get('demo')
  async getDemo(@Res() res: Response) {
    res.header('Content-Type', 'text/html');
    const filePath = `${__dirname}/demo/hls-player.html`;
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
