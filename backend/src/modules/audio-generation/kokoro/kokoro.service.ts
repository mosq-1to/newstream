import { Injectable, OnModuleInit } from '@nestjs/common';
import { KokoroTTS } from 'kokoro-js';
import path from 'path';
import fs from 'fs/promises';

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;
  constructor() {}

  async onModuleInit() {
    try {
      const tts = (await import('kokoro-js')).KokoroTTS;
      this.kokoro = await tts.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: 'q8',
          device: 'cpu',
        },
      );
    } catch (error) {
      console.error('Error initializing Kokoro', error);
    }
  }

  public async *generateSpeech(text: string, outputDir: string) {
    const splitter = new (await import('kokoro-js')).TextSplitterStream();
    const stream = this.kokoro.stream(splitter);
    await this.ensureDirectoryExists(outputDir);
    console.log('outputDir', outputDir);

    splitter.push(text);
    splitter.close();

    let i = 1;
    for await (const { text, phonemes, audio } of stream) {
      console.log({ text, phonemes });
      const filePath = path.join(
        outputDir,
        `segment_${String(i++).padStart(3, '0')}.wav`,
      );
      await audio.save(filePath);
      yield filePath;
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
