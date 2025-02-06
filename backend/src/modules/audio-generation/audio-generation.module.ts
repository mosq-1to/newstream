import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audiio-generation.controller';
import { KokoroService } from './tts/kokoro.service';

@Module({
  providers: [AudioGenerationService, KokoroService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
