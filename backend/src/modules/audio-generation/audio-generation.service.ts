import { Injectable } from '@nestjs/common';
import type { KokoroService } from './tts/kokoro.service';

@Injectable()
export class AudioGenerationService {
  constructor(private readonly kokoroService: KokoroService) {}

  public async generateSpeech(text: string) {
    return await this.kokoroService.generateSpeech(text);
  }
}
