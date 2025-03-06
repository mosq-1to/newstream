import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audiio-generation.controller';
import { KokoroService } from './tts/kokoro.service';
import { AudioProcessingModule } from '../audio-processing/audio-processing.module';

@Module({
  imports: [AudioProcessingModule],
  providers: [AudioGenerationService, KokoroService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
