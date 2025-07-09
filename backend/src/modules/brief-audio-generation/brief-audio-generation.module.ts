import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FlowProducerName } from '../../types/flow-producer.enum';
import { BriefAudioGenerationQueue } from './brief-audio-generation.queue';
import { BriefsModule } from '../briefs/briefs.module';
import { BriefAudioGenerationJobProcessor } from './brief-audio-generation.job-processor';
import { StorageModule } from '../storage/storage.module';
import { AudioGenerationModule } from '../audio-generation/audio-generation.module';
import { HlsService } from '../../utils/audio/hls.service';
import { GenerateBriefAudioUseCase } from './use-cases/generate-brief-audio.use-case';

@Module({
  imports: [
    BriefsModule,
    BullModule.registerQueue({ name: QueueName.BriefAudioGeneration }),
    BullBoardModule.forFeature({
      name: QueueName.BriefAudioGeneration,
      adapter: BullMQAdapter,
    }),
    BullModule.registerFlowProducer({
      name: FlowProducerName.BriefAudioGeneration,
    }),
    StorageModule,
    AudioGenerationModule,
  ],
  providers: [
    BriefAudioGenerationQueue,
    BriefAudioGenerationJobProcessor,
    HlsService,
    GenerateBriefAudioUseCase,
  ],
  exports: [BriefAudioGenerationQueue, GenerateBriefAudioUseCase],
})
export class BriefAudioGenerationModule {}
