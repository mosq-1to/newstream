import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { BriefAudioGenerationModule } from '../brief-audio-generation/brief-audio-generation.module';
import { BriefsModule } from '../briefs/briefs.module';
import { HlsService } from '../../utils/audio/hls.service';

@Module({
  imports: [
    StorageModule,
    BriefAudioGenerationModule,
    BriefsModule
  ],
  controllers: [],
  providers: [HlsService],
})
export class StreamModule { }
