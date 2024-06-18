import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsSpeechGenerationStrategy } from './strategies/elevenlabs-speech-generation-strategy';
import { SpeechGenerationStrategy } from './strategies/speech-generation-strategy.interface';

@Injectable()
export class TextToSpeechService {
  private readonly speechGenerationStrategy: SpeechGenerationStrategy;

  constructor(private readonly configService: ConfigService) {
    this.speechGenerationStrategy = new ElevenLabsSpeechGenerationStrategy(
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
