import { SpeechGenerationStrategy } from './speech-generation-strategy.interface';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import * as stream from 'stream';

export class OpenaiSpeechGenerationStrategy
  implements SpeechGenerationStrategy
{
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: configService.get('OPENAI_API_KEY'),
    });
  }

  async convertTextToSpeech(text: string) {
    const data = await this.openai.audio.speech.create({
      voice: 'echo',
      model: 'tts-1', // low quality
      input: text,
    });

    return stream.Readable.from(Buffer.from(await data.arrayBuffer()));
  }
}
