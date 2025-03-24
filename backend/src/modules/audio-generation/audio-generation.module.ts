import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audio-generation.controller';
import { KokoroService } from './kokoro/kokoro.service';
import { HlsService } from './hls/hls.service';

@Module({
  providers: [AudioGenerationService, KokoroService, HlsService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
