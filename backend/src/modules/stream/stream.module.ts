import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { BriefAudioGenerationModule } from '../brief-audio-generation/brief-audio-generation.module';
import { BriefsModule } from '../briefs/briefs.module';
import { HlsService } from '../../utils/audio/hls.service';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [StorageModule, BriefAudioGenerationModule, BriefsModule],
  controllers: [StreamController],
  providers: [HlsService, StreamService],
})
export class StreamModule {}
