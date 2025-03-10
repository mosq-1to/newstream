import { Injectable } from '@nestjs/common';
import { KokoroService } from './tts/kokoro.service';
import { AudioProcessingService } from '../audio-processing/audio-processing.service';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { HlsService } from './hls/hls.service';

@Injectable()
export class AudioGenerationService {
  constructor(
    private readonly kokoroService: KokoroService,
    private readonly audioProcessingService: AudioProcessingService,
    private readonly hlsService: HlsService,
  ) {}

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
   * Get the path to an HLS stream file (playlist or segment)
   */
  public async getHlsFilePath(
    streamId: string,
    filename: string,
  ): Promise<string> {
    return this.hlsService.getStreamFilePath(streamId, filename);
  }

  /**
   * Clean up an HLS stream when it's no longer needed
   */
  public async cleanupHlsStream(streamId: string): Promise<void> {
    await this.hlsService.cleanupStream(streamId);
  }
}
