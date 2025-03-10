import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import type { Response } from 'express';
import * as path from 'path';
import { createReadStream } from 'fs';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IsString } from 'class-validator';

// DTO for text input
class GenerateSpeechDto {
  @IsString()
  text: string;
}

@Controller('test/tts')
export class AudioGenerationController {
  constructor(
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  @Post()
  @Header('Content-Type', 'audio/wav')
  @Header('Content-Disposition', 'inline; filename="stream.wav"')
  async generateSpeech(@Res() res: Response) {
    const audioStream = await this.audioGenerationService.generateSpeechStream(
      'The sky above the port was the color of television, tuned to a dead channel.\n' +
        '"It\'s not like I\'m using," Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. "It\'s like my body\'s developed this massive drug deficiency."\n' +
        'It was a Sprawl voice and a Sprawl joke. The Chatsubo was a bar for professional expatriates; you could drink there for a week and never hear two words in Japanese.\n' +
        '\n' +
        'These were to have an enormous impact, not only because they were associated with Constantine, but also because, as in so many other areas, the decisions taken by Constantine (or in his name) were to have great significance for centuries to come. One of the main issues was the shape that Christian churches were to take, since there was not, apparently, a tradition of monumental church buildings when Constantine decided to help the Christian church build a series of truly spectacular structures. The main form that these churches took was that of the basilica, a multipurpose rectangular structure, based ultimately on the earlier Greek stoa, which could be found in most of the great cities of the empire. Christianity, unlike classical polytheism, needed a large interior space for the celebration of its religious services, and the basilica aptly filled that need. We naturally do not know the degree to which the emperor was involved in the design of new churches, but it is tempting to connect this with the secular basilica that Constantine completed in the Roman forum (the so-called Basilica of Maxentius) and the one he probably built in Trier, in connection with his residence in the city at a time when he was still caesar.',
    );

    audioStream.pipe(res);
  }

  /**
   * Generate a speech audio and convert it to HLS format
   * Returns the stream ID that can be used to access the HLS playlist
   */
  @Post('hls')
  @SkipAuth()
  async generateSpeechHls(
    @Body() generateSpeechDto: GenerateSpeechDto,
    @Res() res: Response,
  ) {
    // Use the text from request body or a default if not provided
    const text =
      generateSpeechDto?.text ||
      'The sky above the port was the color of television, tuned to a dead channel.\n' +
        '"It\'s not like I\'m using," Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. "It\'s like my body\'s developed this massive drug deficiency."';

    const streamId = await this.audioGenerationService.generateSpeechHls(text);

    // Return the stream ID and playlist URL
    res.json({
      streamId,
      playlistUrl: `/test/tts/hls/${streamId}/playlist.m3u8`,
    });
  }

  /**
   * Get the HLS playlist file
   */
  @Get('hls/:streamId/:filename')
  @SkipAuth()
  async getHlsFile(
    @Param('streamId') streamId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.audioGenerationService.getHlsFilePath(
        streamId,
        filename,
      );

      // Set the appropriate content type based on file extension
      const ext = path.extname(filename);
      if (ext === '.m3u8') {
        res.header('Content-Type', 'application/vnd.apple.mpegurl');
      } else if (ext === '.ts') {
        res.header('Content-Type', 'video/mp2t');
      }

      // Set cache control headers for HLS
      res.header('Cache-Control', 'public, max-age=3600');

      // Stream the file
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).json({ error: 'File not found' });
    }
  }

  /**
   * Delete an HLS stream when it's no longer needed
   */
  @Post('hls/:streamId/cleanup')
  @SkipAuth()
  async cleanupHlsStream(
    @Param('streamId') streamId: string,
    @Res() res: Response,
  ) {
    await this.audioGenerationService.cleanupHlsStream(streamId);
    res.json({ success: true });
  }

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
