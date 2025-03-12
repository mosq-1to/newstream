import { Injectable, NotFoundException } from '@nestjs/common';
import { KokoroService } from './tts/kokoro.service';
import { AudioProcessingService } from '../audio-processing/audio-processing.service';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { HlsService } from './hls/hls.service';
import * as path from 'path';
import { existsSync } from 'fs';
import { tmpdir } from 'os';

@Injectable()
export class AudioGenerationService {
  constructor(
    private readonly kokoroService: KokoroService,
    private readonly audioProcessingService: AudioProcessingService,
    private readonly hlsService: HlsService,
  ) {}

  HLS_OUTPUT_DIR = path.join(tmpdir(), 'newstream-hls-output');

  public async generateSpeechStream(text: string): Promise<Readable> {
    const filePaths = await this.kokoroService.generateSpeech(text);
    const mergedFilePath =
      await this.audioProcessingService.mergeWavFiles(filePaths);

    // Create a readable stream from the merged file
    const readableStream = createReadStream(mergedFilePath);

    // Set up cleanup to happen after the stream is consumed
    readableStream.on('end', () => {
      // Clean up all the files (original files and merged file)
      void this.audioProcessingService.cleanupFiles([
        ...filePaths,
        mergedFilePath,
      ]);
    });

    readableStream.on('error', () => {
      // Also clean up on error
      void this.audioProcessingService.cleanupFiles([
        ...filePaths,
        mergedFilePath,
      ]);
    });

    return readableStream;
  }

  /**
   * Generate speech and convert it to HLS format
   * @param text Text to convert to speech
   * @returns Stream ID that can be used to access the HLS playlist
   */
  public async generateSpeechHls(text: string): Promise<string> {
    const filePaths = await this.kokoroService.generateSpeech(text);
    const mergedFilePath =
      await this.audioProcessingService.mergeWavFiles(filePaths);

    try {
      // Convert the merged audio file to HLS format
      const { streamId } = await this.hlsService.convertToHls(mergedFilePath);

      // Clean up the temporary files
      void this.audioProcessingService.cleanupFiles([
        ...filePaths,
        mergedFilePath,
      ]);

      return streamId;
    } catch (error) {
      // Clean up on error
      void this.audioProcessingService.cleanupFiles([
        ...filePaths,
        mergedFilePath,
      ]);
      throw error;
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
    const filePath = path.join(streamDir, 'segments', `${segmentId}`);

    // Verify file exists
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        `Segment ${segmentId} not found for stream: ${streamId}`,
      );
    }

    return filePath;
  }

  /**
   * Clean up an HLS stream when it's no longer needed
   */
  public async cleanupHlsStream(streamId: string): Promise<void> {
    await this.hlsService.cleanupStream(streamId);
  }
}
