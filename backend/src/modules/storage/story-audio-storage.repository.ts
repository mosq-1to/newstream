import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { ensureDirectoryExists } from '../../utils/files/ensure-directory-exists';
import fs from 'fs';

@Injectable()
export class StoryAudioStorageRepository {
  constructor(private readonly configService: ConfigService) {}

  getStoryPaths(storyId: string) {
    const outputDir = this.getStoryOutputDir(storyId);
    const wavOutputDir = this.getStoryWavFilesDir(storyId);
    const wavFiles = this.getStoryWavFiles(storyId);
    const hlsOutputDir = this.getStoryHlsFilesDir(storyId);

    return {
      outputDir,
      wavOutputDir,
      wavFiles,
      hlsOutputDir,
    };
  }

  private getStoryOutputDir(storyId: string) {
    const outputDir = path.join(
      this.configService.getOrThrow<string>('AUDIO_STORAGE_DIR'),
      'stories-audio',
      storyId,
    );
    ensureDirectoryExists(outputDir);

    return outputDir;
  }

  private getStoryWavFilesDir(storyId: string) {
    const outputDir = this.getStoryOutputDir(storyId);
    const wavFilesDir = path.join(outputDir, 'wav');
    ensureDirectoryExists(wavFilesDir);

    return wavFilesDir;
  }

  private getStoryWavFiles(storyId: string) {
    const wavFilesDir = this.getStoryWavFilesDir(storyId);
    ensureDirectoryExists(wavFilesDir);

    return fs.readdirSync(wavFilesDir).map((p) => path.join(wavFilesDir, p));
  }

  private getStoryHlsFilesDir(storyId: string) {
    const outputDir = this.getStoryOutputDir(storyId);
    const hlsFilesDir = path.join(outputDir, 'hls');
    ensureDirectoryExists(hlsFilesDir);

    return hlsFilesDir;
  }
}
