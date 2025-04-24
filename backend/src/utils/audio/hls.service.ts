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

    await fs.promises.writeFile(playlistFilePath, initialContent);
    return playlistFilePath;
  }

  private getExistingSegments(outputDir: string): string[] {
    try {
      // Read all files in the directory
      const files = fs.readdirSync(outputDir);

      // Filter for segment files and sort them by segment number
      return files
        .filter((file) => file.startsWith('segment_') && file.endsWith('.ts'))
        .sort((a, b) => {
          // Extract segment numbers for sorting
          const numA = parseInt(a.replace('segment_', '').replace('.ts', ''), 10);
          const numB = parseInt(b.replace('segment_', '').replace('.ts', ''), 10);
          return numA - numB;
        });
    } catch (error) {
      // If directory doesn't exist or can't be read, return empty array
      return [];
    }
  }

  async createPlaylistFile(outputDir: string, wavPaths: string[]): Promise<string> {
    const playlistFilePath = path.join(outputDir, 'playlist.m3u8');

    if (wavPaths.length === 0) {
      return this.createEmptyPlaylistFile(playlistFilePath);
    }

    // Get existing segments to determine the starting index for new segments
    const existingSegments = this.getExistingSegments(outputDir);
    const startIndex = existingSegments.length;

    // Create a temporary concat file with only new WAV files
    const concatFile = path.join(outputDir, `concat.txt`);

    // If we have existing segments, only process the new WAV files
    // This assumes WAV files are processed in order and match the segment order
    const newWavPaths = wavPaths.slice(startIndex);

    // If no new WAV files to process, just return the existing playlist
    if (newWavPaths.length === 0) {
      return playlistFilePath;
    }

    const concatContent = newWavPaths.map((p) => `file '${path.resolve(p)}'`).join('\n');
    await fs.promises.writeFile(concatFile, concatContent);

    return new Promise((resolve, reject) => {
      const ffmpegCommand = ffmpeg()
        .input(path.resolve(concatFile))
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-f hls',
          '-hls_time 4',
          '-hls_playlist_type event',
          '-hls_segment_filename',
          path.join(outputDir, `segment_%03d.ts`),
          '-hls_list_size 0',
          '-hls_flags append_list',
          // Start segment numbering from the next available index
          `-start_number ${startIndex}`,
        ]);

      // If we have existing segments, use the append mode
      if (existingSegments.length > 0) {
        ffmpegCommand.outputOptions(['-hls_flags append_list+discont_start']);
      }

      ffmpegCommand
        .output(playlistFilePath)
        .on('end', () => {
          resolve(playlistFilePath);
          void fs.promises.rm(concatFile);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
          void fs.promises.rm(concatFile);
        })
        .run();
    });
  }
}
