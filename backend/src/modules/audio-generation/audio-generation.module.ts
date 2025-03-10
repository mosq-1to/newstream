import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audio-generation.controller';
import { KokoroService } from './tts/kokoro.service';
import { AudioProcessingModule } from '../audio-processing/audio-processing.module';
import { HlsService } from './hls/hls.service';

@Module({
  imports: [AudioProcessingModule],
  providers: [AudioGenerationService, KokoroService, HlsService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
