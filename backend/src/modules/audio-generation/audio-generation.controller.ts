import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';
import { createReadStream } from 'fs';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@Controller('test/tts')
export class AudioGenerationController {
  /**
   * Serve the HLS player demo page
   */
  @Get('demo')
  @SkipAuth()
  @Header('Content-Type', 'text/html')
  async serveDemo(@Res() res: Response) {
    try {
      const demoPath = path.join(__dirname, 'demo', 'hls-player.html');
      const fileStream = createReadStream(demoPath);
      fileStream.pipe(res);
    } catch (error) {
      res
        .status(404)
        .send(
          'Demo page not found. Please make sure to build the application with assets.',
        );
    }
  }
}
