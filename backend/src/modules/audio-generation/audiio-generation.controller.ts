import { Controller, Post } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';

@Controller('test/tts')
export class AudioGenerationController {
  constructor(
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  @Post()
  async generateSpeech() {
    return this.audioGenerationService.generateSpeech('Hello world');
  }
}
