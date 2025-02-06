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
  }>;
}

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;

  constructor() {}

  async onModuleInit() {
    const kokoroTTS = (await import('kokoro-js')).KokoroTTS;
    this.kokoro = (await kokoroTTS.from_pretrained(
      'onnx-community/Kokoro-82M-ONNX',
    )) as unknown as KokoroTTS;
  }

  public async generateSpeech(text: string): Promise<Buffer> {
    if (!this.kokoro) {
      throw new Error('Kokoro not initialized');
    }
    const audio = await this.kokoro.generate(text, { voice: 'af_bella' });
    const arrayBuffer = await audio.toWav();
    return Buffer.from(arrayBuffer);
  }
}
