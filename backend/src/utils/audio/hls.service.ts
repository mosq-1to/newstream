import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { ConfigService } from '@nestjs/config';
import { ensureDirectoryExists } from '../files/ensure-directory-exists';

@Injectable()
export class HlsService {
  private readonly HLS_OUTPUT_DIR: string;

  constructor(private configService: ConfigService) {
    this.HLS_OUTPUT_DIR =
      this.configService.getOrThrow<string>('HLS_OUTPUT_DIR');

    ensureDirectoryExists(this.HLS_OUTPUT_DIR);
  }

  private async initializeEmptyPlaylist(streamId: string): Promise<string> {
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId, 'stream');
    ensureDirectoryExists(streamDir);
    const playlistFile = path.join(streamDir, 'playlist.m3u8');

    const initialContent = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      '#EXT-X-PLAYLIST-TYPE:EVENT', // Signals this is a live event
      '#EXT-X-TARGETDURATION:4', // Must match your segment duration
      '#EXT-X-MEDIA-SEQUENCE:0',
    ].join('\n');

    fs.writeFileSync(playlistFile, initialContent);
    return playlistFile;
  }

  async generatePlaylist(streamId: string): Promise<string> {
    // Create a directory for this stream
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId, 'stream');
    const streamSegmentsDir = path.join(streamDir, 'segments');

    // Ensure both directories exist
    ensureDirectoryExists(streamDir);
    ensureDirectoryExists(streamSegmentsDir);

    // Output playlist file
    const playlistFile = path.join(streamDir, 'playlist.m3u8');

    const wavPaths = fs
      .readdirSync(streamSegmentsDir)
      .map((p) => path.join(streamSegmentsDir, p));

    if (wavPaths.length === 0) {
      return this.initializeEmptyPlaylist(streamId);
    }

    // Create a temporary concat file
    const concatFile = path.join(this.HLS_OUTPUT_DIR, `${streamId}_concat.txt`);
    const concatContent = wavPaths.map((p) => `file '${p}'`).join('\n');
    fs.writeFileSync(concatFile, concatContent);

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(concatFile)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-f hls',
          '-hls_time 4',
          '-hls_playlist_type event',
          '-hls_segment_filename',
          path.join(streamSegmentsDir, 'segment_%03d.ts'),
          '-hls_list_size 0',
          '-hls_base_url',
          'stream/segments/',
          '-hls_flags append_list',
        ])
        .output(playlistFile)
        .on('end', () => {
          resolve(playlistFile);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .run();
    });
  }
}
