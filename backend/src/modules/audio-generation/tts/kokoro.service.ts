import { Injectable, OnModuleInit } from '@nestjs/common';
import { KokoroTTS, ITextSplitterStream } from 'kokoro-js';

@Injectable()
export class KokoroService implements OnModuleInit {
  private kokoro: KokoroTTS;
  private TextSplitterStream: ITextSplitterStream;

  constructor() {}

  async onModuleInit() {
    try {
      const kokoroImport = await import('kokoro-js');

      const tts = kokoroImport.KokoroTTS;
      this.kokoro = await tts.from_pretrained(
        'onnx-community/Kokoro-82M-v1.0-ONNX',
        {
          dtype: 'q8',
          device: 'cpu',
        },
      );

      this.TextSplitterStream = kokoroImport.TextSplitterStream;
    } catch (error) {
      console.error('Error initializing Kokoro', error);
    }
  }

  public async generateSpeech(text: string) {
    const splitter = new this.TextSplitterStream();
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
