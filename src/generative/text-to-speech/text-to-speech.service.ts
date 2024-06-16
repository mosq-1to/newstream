import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TextToSpeechService {
  API_KEY = '';
  API_URL = '';

  constructor(private readonly configService: ConfigService) {
    this.API_KEY = this.configService.get('ELEVENLABS_API_KEY');
    this.API_URL = this.configService.get('ELEVENLABS_API_URL');
  }

  generateSpeech(text: string) {
    console.log(this.API_KEY, this.API_URL);

    return text;
  }
}
