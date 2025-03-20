import { Injectable, OnModuleInit } from '@nestjs/common';

interface KokoroTTS {
  generate(
    text: string,
    {
      voice,
      speed,
    }?: {
      voice?: 'af_heart';
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
    try {
      const kokoroTTS = (await import('kokoro-js')).KokoroTTS;
      this.kokoro = (await kokoroTTS.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: 'q8',
          device: 'cpu',
        },
      )) as unknown as KokoroTTS;
    } catch (error) {
      console.error('Error initializing Kokoro', error);
    }
  }

  public async generateSpeech(text: string): Promise<string[]> {
    const textChunks = text.split('.'); // Split text into chunks of 3 sentences temporarily

    if (!this.kokoro) {
      throw new Error('Kokoro not initialized');
    }

    const kokoro = this.kokoro;
    const filePaths: string[] = [];

    for (const chunk of textChunks) {
      const audio = await kokoro.generate(chunk, { voice: 'af_heart' });
      const filePath = `temp-${new Date().getTime()}.wav`;
      await audio.save(filePath);
      filePaths.push(filePath);
    }

    return filePaths;
  }
}
