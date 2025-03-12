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
    const streamId = await this.audioGenerationService.generateSpeechHls(
      generateSpeechDto.text,
    );

    // Return the stream ID and playlist URL
    res.json({
      streamId,
      playlistUrl: `/test/tts/hls/${streamId}/playlist.m3u8`,
    });
  }

  /**
   * Get the HLS playlist file
   */
  @Get('hls/:streamId/playlist.m3u8')
  @SkipAuth()
  async getHlsPlaylist(
    @Param('streamId') streamId: string,
    @Res() res: Response,
  ) {
    try {
      const filePath =
        await this.audioGenerationService.getPlaylistFilePath(streamId);

      // Set content type for m3u8
      res.header('Content-Type', 'application/vnd.apple.mpegurl');

      // For playlists, use a shorter cache time to allow for dynamic updates
      res.header('Cache-Control', 'public, max-age=2');

      // Stream the file
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      // Handle error (keep existing error handling)
      throw error;
    }
  }

  /**
   * Get the HLS segment file
   */
  @Get('hls/:streamId/segments/:segmentId')
  @SkipAuth()
  async getHlsSegment(
    @Param('streamId') streamId: string,
    @Param('segmentId') segmentId: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.audioGenerationService.getSegmentFilePath(
        streamId,
        segmentId,
      );

      // Set content type for ts segments
      res.header('Content-Type', 'video/mp2t');

      // Segments can be cached longer as they don't change
      res.header('Cache-Control', 'public, max-age=3600');

      // Stream the file
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      // Handle error (keep existing error handling)
      throw error;
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
