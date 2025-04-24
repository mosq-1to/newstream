import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { HlsService } from '../../utils/audio/hls.service';
import { StoryAudioGenerationModule } from '../story-audio-generation/story-audio-generation.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StoryAudioGenerationModule, StorageModule],
  providers: [StreamService, HlsService],
  controllers: [StreamController],
})
export class StreamModule {}
