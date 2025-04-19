import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audio-generation.controller';
import { HlsService } from '../../utils/audio/hls.service';
import { ConfigService } from '@nestjs/config';
import { KokoroService } from '../../ai/kokoro/kokoro.service';

@Module({
  providers: [
    AudioGenerationService,
    KokoroService,
    {
      provide: HlsService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new HlsService(configService.get<string>('HLS_OUTPUT_DIR'));
      },
    },
  ],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
