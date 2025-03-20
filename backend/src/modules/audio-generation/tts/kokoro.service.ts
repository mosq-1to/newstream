import { Injectable, OnModuleInit } from '@nestjs/common';

interface KokoroTTS {
  generate(
    text: string,
    {
      voice,
      speed,
    }?: {
      voice?: 'af_bella';
      speed?: number;
    },
  ): Promise<{
    toWav: () => Promise<ArrayBuffer>;
    toBlob: () => Promise<Blob>;
    save: (path: string) => Promise<void>;
  }>;
}

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;

  constructor() {}

  async onModuleInit() {
    const kokoroTTS = (await import('kokoro-js')).KokoroTTS;
    this.kokoro = (await kokoroTTS.from_pretrained(
      'onnx-community/Kokoro-82M-v1.0-ONNX',
    )) as unknown as KokoroTTS;
  }

  public async generateSpeech(text: string): Promise<string[]> {
    const textChunks = text.split('.'); // Split text into chunks of 3 sentences temporarily

    if (!this.kokoro) {
      throw new Error('Kokoro not initialized');
    }

    const kokoro = this.kokoro;
    const filePaths: string[] = [];

    for (const chunk of textChunks) {
      const audio = await kokoro.generate(chunk);
      const filePath = `temp-${new Date().getTime()}.wav`;
      await audio.save(filePath);
      filePaths.push(filePath);
    }

    return filePaths;
  }
}
