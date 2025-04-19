import { Injectable, OnModuleInit } from '@nestjs/common';
import { KokoroTTS, TextSplitterStream } from 'kokoro-js';
import path from 'path';
import { ensureDirectoryExists } from '../../utils/files/ensure-directory-exists';

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;
  constructor() {}

  async onModuleInit() {
    try {
      this.kokoro = await KokoroTTS.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: 'fp32',
          device: 'cpu',
        },
      );
    } catch (error) {
      console.error('Error initializing Kokoro', error);
    }
  }

  public async *generateSpeech(text: string, outputDir: string) {
    const splitter = new TextSplitterStream();
    const stream = this.kokoro.stream(splitter);
    ensureDirectoryExists(outputDir);

    splitter.push(text);
    splitter.close();

    let i = 1;
    for await (const { audio } of stream) {
      const filePath = path.join(
        outputDir,
        `segment_${String(i++).padStart(3, '0')}.wav`,
      );
      await audio.save(filePath);
      yield filePath;
    }
  }
}
