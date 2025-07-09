import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { KokoroService } from '../../ai/kokoro/kokoro.service';

@Module({
  providers: [AudioGenerationService, KokoroService],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
