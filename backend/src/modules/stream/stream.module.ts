import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { StoryAudioGenerationModule } from '../story-audio-generation/story-audio-generation.module';
import { StoryGenerationModule } from '../story-generation/story-generation.module';
import { StorageModule } from '../storage/storage.module';
import { BriefAudioGenerationModule } from '../brief-audio-generation/brief-audio-generation.module';
import { BriefsModule } from '../briefs/briefs.module';
import { HlsService } from '../../utils/audio/hls.service';

@Module({
  imports: [
    StoryAudioGenerationModule,
    StoryGenerationModule,
    StorageModule,
    BriefAudioGenerationModule,
    BriefsModule
  ],
  controllers: [StreamController],
  providers: [HlsService, StreamService],
})
export class StreamModule { }
