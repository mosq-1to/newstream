import { Injectable, NotFoundException } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import * as path from 'path';
import { existsSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { KokoroService } from '../../ai/kokoro/kokoro.service';

@Injectable()
export class AudioGenerationService {
  private readonly HLS_OUTPUT_DIR: string;
  constructor(
    private readonly kokoroService: KokoroService,
    private readonly hlsService: HlsService,
    private readonly configService: ConfigService,
  ) {
    // Get HLS output directory from environment or use system temp folder as fallback
    this.HLS_OUTPUT_DIR =
      this.configService.getOrThrow<string>('HLS_OUTPUT_DIR');
  }

  public async generateSpeechHls(
    text: string,
    streamId: string,
  ): Promise<string> {
    const outputDir = path.join(
      this.HLS_OUTPUT_DIR,
      streamId,
      'stream/segments',
    );
    const speechStream = await this.kokoroService.generateSpeech(
      text,
      outputDir,
    );

    for await (const filePath of speechStream) {
      console.log('filePath', filePath);
      // @ts-ignore
      return await this.hlsService.generatePlaylist(streamId);
    }
  }

  /**
   * Get the file path for an HLS playlist
   */
  async getPlaylistFilePath(streamId: string): Promise<string> {
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId);
    const filePath = path.join(streamDir, 'playlist.m3u8');

    // Verify file exists
    if (!existsSync(filePath)) {
      throw new NotFoundException(`Playlist not found for stream: ${streamId}`);
    }

    return filePath;
  }

  /**
   * Get the file path for an HLS segment
   */
  async getSegmentFilePath(
    streamId: string,
    segmentId: string,
  ): Promise<string> {
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId);
    const filePath = path.join(streamDir, 'stream', 'segments', `${segmentId}`);

    // Verify file exists
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        `Segment ${segmentId} not found for stream: ${streamId}`,
      );
    }

    return filePath;
  }
}
