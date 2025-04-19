import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import { ensureDirectoryExists } from '../../utils/files/ensure-directory-exists';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly configService: ConfigService,
  ) {}

  public async getStoryPlaylistFile(storyId: string) {
    const outputDir = path.join(
      this.configService.getOrThrow<string>('AUDIO_STORAGE_DIR'),
      'stories-audio',
      storyId,
    );
    ensureDirectoryExists(outputDir);

    const wavFilesDir = path.join(outputDir, 'wav');
    ensureDirectoryExists(wavFilesDir);

    const wavPaths = fs
      .readdirSync(wavFilesDir)
      .map((p) => path.join(wavFilesDir, p));

    //todo - initialize audio generation process for the story if not started

    return await this.hlsService.createPlaylistFile(
      path.join(outputDir, 'hls'),
      wavPaths,
    );
  }
}
