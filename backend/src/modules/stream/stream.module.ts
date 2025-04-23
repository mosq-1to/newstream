import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { HlsService } from '../../utils/audio/hls.service';
import { StreamRepository } from './stream.repository';
import { StoryAudioGenerationModule } from '../story-audio-generation/story-audio-generation.module';

@Module({
  imports: [StoryAudioGenerationModule],
  providers: [StreamService, HlsService, StreamRepository],
  controllers: [StreamController],
})
export class StreamModule {}
