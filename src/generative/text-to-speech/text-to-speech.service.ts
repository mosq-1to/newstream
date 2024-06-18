import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpeechGenerationStrategy } from './strategies/speech-generation-strategy.interface';
import { OpenaiSpeechGenerationStrategy } from './strategies/openai-speech-generation-strategy';

@Injectable()
export class TextToSpeechService {
  private readonly speechGenerationStrategy: SpeechGenerationStrategy;

  constructor(private readonly configService: ConfigService) {
    this.speechGenerationStrategy = new OpenaiSpeechGenerationStrategy(
      this.configService,
    );
  }

  async convertTextToSpeech(text: string) {
    try {
      return this.speechGenerationStrategy.convertTextToSpeech(text);
    } catch (e) {
      throw new InternalServerErrorException('Error generating audio');
    }
  }
}
