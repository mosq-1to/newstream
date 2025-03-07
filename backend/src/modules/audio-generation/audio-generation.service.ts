import { Injectable } from '@nestjs/common';
import { KokoroService } from './tts/kokoro.service';
import { AudioProcessingService } from '../audio-processing/audio-processing.service';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class AudioGenerationService {
  constructor(
    private readonly kokoroService: KokoroService,
    private readonly audioProcessingService: AudioProcessingService,
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
}
