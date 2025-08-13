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
    BullModule.registerQueue({
      name: QueueName.BriefAudioGeneration,
      settings: {
        maxStalledCount: 3,
        lockDuration: 120 * 1000,
        stalledInterval: 120 * 1000,
      } as any, // poorly typed BullMQ module
    }),
    BullBoardModule.forFeature({
      name: QueueName.BriefAudioGeneration,
      adapter: BullMQAdapter,
    }),
    BullModule.registerFlowProducer({
      name: FlowProducerName.BriefAudioGeneration,
      /**@ts-expect-error poorly typed BullMQ module */
      settings: {
        maxStalledCount: 3,
        lockDuration: 120 * 1000,
        stalledInterval: 120 * 1000,
      },
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
