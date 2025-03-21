import { WorldNewsArticleDto } from './../../articles/api/providers/worldnewsapi/dto/world-news-article.dto';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HlsService {
  private readonly HLS_OUTPUT_DIR: string;

  constructor(private configService: ConfigService) {
    // Get HLS output directory from environment or use system temp folder as fallback
    this.HLS_OUTPUT_DIR =
      this.configService.getOrThrow<string>('HLS_OUTPUT_DIR');

    // Create the HLS output directory if it doesn't exist
    void this.ensureDirectoryExists(this.HLS_OUTPUT_DIR);
  }

  /**
   * Converts an audio file to HLS format
   * @param inputFilePath Path to the input audio file
   * @param streamId Custom ID for the HLS stream
   * @returns ID of the HLS stream and path to the playlist file
   */
  async convertToHls(
    inputFilePath: string,
    streamId: string,
  ): Promise<{ streamId: string; playlistPath: string }> {
    // Create a directory for this stream
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId, 'stream');
    await this.ensureDirectoryExists(streamDir);
    const streamSegmentsDir = path.join(streamDir, 'segments');
    await this.ensureDirectoryExists(streamSegmentsDir);
    // Output playlist file
    const playlistFile = path.join(streamDir, 'playlist.m3u8');

    return new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .outputOptions([
          '-f hls',
          '-hls_time 4',
          '-hls_playlist_type vod',
          '-hls_segment_filename',
          path.join(streamSegmentsDir, 'segment_%03d.ts'),
          '-hls_list_size 0',
          '-hls_base_url',
          'stream/segments/',
          '-acodec aac',
          '-ar 44100',
          '-ab 128k',
        ])
        .output(playlistFile)
        .on('end', () => {
          resolve({
            streamId,
            playlistPath: playlistFile,
          });
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  }

  private async initializeEmptyPlaylist(streamId: string): Promise<string> {
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId, 'stream');
    await this.ensureDirectoryExists(streamDir);
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
    await this.ensureDirectoryExists(streamDir);
    await this.ensureDirectoryExists(streamSegmentsDir);

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

  /**
   * Gets the path to a segment or playlist file
   */
  async getStreamFilePath(streamId: string, filename: string): Promise<string> {
    const filePath = path.join(this.HLS_OUTPUT_DIR, streamId, filename);

    try {
      fs.accessSync(filePath);
      return filePath;
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  /**
   * Helper method to ensure a directory exists
   */
  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      fs.mkdirSync(directory, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
    }
  }
}
