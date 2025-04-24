import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class HlsService {
  private async createEmptyPlaylistFile(playlistFilePath: string): Promise<string> {
    const initialContent = [
      '#EXTM3U',
      '#EXT-X-VERSION:3',
      '#EXT-X-PLAYLIST-TYPE:EVENT', // Signals this is a live event
      '#EXT-X-TARGETDURATION:4', // Must match your segment duration
      '#EXT-X-MEDIA-SEQUENCE:0',
    ].join('\n');

    fs.writeFileSync(playlistFilePath, initialContent);
    return playlistFilePath;
  }

  async createPlaylistFile(outputDir: string, wavPaths: string[]): Promise<string> {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    if (wavPaths.length === 0) {
      return this.createEmptyPlaylistFile(playlistFilePath);
    }

    // Create a temporary concat file
    // todo - maybe I can avoid writing concat file passing it directly
    const concatFile = path.join(outputDir, `concat.txt`);
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
          path.join(outputDir, 'segment_%03d.ts'),
          '-hls_list_size 0',
          // '-hls_base_url',
          // '',
          '-hls_flags append_list',
        ])
        .output(playlistFilePath)
        .on('end', () => {
          resolve(playlistFilePath);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .run();
    });
  }
}
