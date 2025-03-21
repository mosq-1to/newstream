import { Injectable, OnModuleInit } from '@nestjs/common';
import { KokoroTTS } from 'kokoro-js';

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

  public async generateSpeech(text: string) {
    const splitter = new (await import('kokoro-js')).TextSplitterStream();
    const stream = this.kokoro.stream(splitter);

    void (async () => {
      let i = 0;
      for await (const { text, phonemes, audio } of stream) {
        console.log({ text, phonemes });
        await audio.save(`audio-${i++}.wav`);
      }
    })();

    splitter.push(text);
    splitter.close();

    return [];
  }
}
