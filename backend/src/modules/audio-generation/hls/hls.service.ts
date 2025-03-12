import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
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
   * @returns ID of the generated HLS stream and path to the playlist file
   */
  async convertToHls(
    inputFilePath: string,
  ): Promise<{ streamId: string; playlistPath: string }> {
    // Create a unique ID for this stream
    const streamId = uuidv4();

    // Create a directory for this stream
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId);
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
          'segments/',
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

  /**
   * Gets the path to a segment or playlist file
   */
  async getStreamFilePath(streamId: string, filename: string): Promise<string> {
    const filePath = path.join(this.HLS_OUTPUT_DIR, streamId, filename);

    try {
      await fs.access(filePath);
      return filePath;
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  }

  /**
   * Cleans up HLS stream files after they're no longer needed
   */
  async cleanupStream(streamId: string): Promise<void> {
    const streamDir = path.join(this.HLS_OUTPUT_DIR, streamId);

    try {
      const files = await fs.readdir(streamDir);

      // Delete all files in the directory
      await Promise.all(
        files.map((file) => fs.unlink(path.join(streamDir, file))),
      );

      // Delete the directory
      await fs.rmdir(streamDir);
    } catch (error) {
      // Ignore errors if directory doesn't exist
    }
  }

  /**
   * Helper method to ensure a directory exists
   */
  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.mkdir(directory, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
    }
  }
}
