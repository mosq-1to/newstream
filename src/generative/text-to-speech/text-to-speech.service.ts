import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ElevenLabsClient } from 'elevenlabs';

@Injectable()
export class TextToSpeechService {
  private elevenLabs: ElevenLabsClient;

  constructor(private readonly configService: ConfigService) {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: this.configService.get('ELEVENLABS_API_KEY'),
    });
  }

  async textToSpeech(@Res() res: Response, text: string) {
    const audio = await this.elevenLabs.generate({
      text: text,
      voice: 'Rachel',
      stream: true,
    });

    res.set({
      'Content-Type': 'audio/mpeg',
    });

    audio.pipe(res);
  }
}
