import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audio-generation.controller';
import { HlsService } from '../../utils/audio/hls.service';
import { KokoroService } from '../../ai/kokoro/kokoro.service';

@Module({
  providers: [AudioGenerationService, KokoroService, HlsService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
