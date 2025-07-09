import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { ensureDirectoryExists } from '../../utils/files/ensure-directory-exists';
import fs from 'fs';

@Injectable()
export class BriefAudioStorageRepository {
  constructor(private readonly configService: ConfigService) {}

  getBriefPaths(briefId: string) {
    const outputDir = this.getBriefOutputDir(briefId);
    const wavOutputDir = this.getBriefWavFilesDir(briefId);
    const wavFiles = this.getBriefWavFiles(briefId);
    const hlsOutputDir = this.getBriefHlsFilesDir(briefId);

    return {
      outputDir,
      wavOutputDir,
      wavFiles,
      hlsOutputDir,
    };
  }

  private getBriefOutputDir(briefId: string) {
    const outputDir = path.join(
      this.configService.getOrThrow<string>('AUDIO_STORAGE_DIR'),
      'briefs-audio',
      briefId,
    );
    ensureDirectoryExists(outputDir);

    return outputDir;
  }

  private getBriefWavFilesDir(briefId: string) {
    const outputDir = this.getBriefOutputDir(briefId);
    const wavFilesDir = path.join(outputDir, 'wav');
    ensureDirectoryExists(wavFilesDir);

    return wavFilesDir;
  }

  private getBriefWavFiles(briefId: string) {
    const wavFilesDir = this.getBriefWavFilesDir(briefId);
    ensureDirectoryExists(wavFilesDir);

    return fs.readdirSync(wavFilesDir).map((p) => path.join(wavFilesDir, p));
  }

  private getBriefHlsFilesDir(briefId: string) {
    const outputDir = this.getBriefOutputDir(briefId);
    const hlsFilesDir = path.join(outputDir, 'hls');
    ensureDirectoryExists(hlsFilesDir);

    return hlsFilesDir;
  }
}
