import { SpeechGenerationStrategy } from './speech-generation-strategy.interface';
import { ElevenLabsClient } from 'elevenlabs';
import { ConfigService } from '@nestjs/config';

export class ElevenLabsSpeechGenerationStrategy
  implements SpeechGenerationStrategy
{
  private elevenLabs: ElevenLabsClient;

  constructor(private readonly configService: ConfigService) {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: this.configService.get('ELEVENLABS_API_KEY'),
    });
  }

  async convertTextToSpeech(text: string) {
    return await this.elevenLabs.generate({
      text: text,
      voice: 'Rachel',
      stream: true,
    });
  }
}
