import { Module } from '@nestjs/common';
import { AudioGenerationService } from './audio-generation.service';
import { AudioGenerationController } from './audiio-generation.controller';

@Module({
  providers: [AudioGenerationService],
  controllers: [AudioGenerationController],
  exports: [AudioGenerationService],
})
export class AudioGenerationModule {}
