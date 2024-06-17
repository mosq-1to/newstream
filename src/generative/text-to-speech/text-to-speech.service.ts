import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsClient } from 'elevenlabs';

@Injectable()
export class TextToSpeechService {
  private elevenLabs: ElevenLabsClient;

  constructor(private readonly configService: ConfigService) {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: this.configService.get('ELEVENLABS_API_KEY'),
    });
  }

  async convertTextToSpeech(text: string) {
    try {
      return await this.elevenLabs.generate({
        text: text,
        voice: 'Rachel',
        stream: true,
      });
    } catch (e) {
      throw new InternalServerErrorException('Error generating audio');
    }
  }
}
