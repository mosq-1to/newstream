import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FlowProducerName } from '../../types/flow-producer.enum';
import { StoryAudioGenerationQueue } from './story-audio-generation.queue';
import { StoriesModule } from '../stories/stories.module';
import { StoryAudioGenerationJobProcessor } from './story-audio-generation.job-processor';
import { StorageModule } from '../storage/storage.module';
import { AudioGenerationModule } from '../audio-generation/audio-generation.module';
import { StoryStreamFilesGenerationModule } from '../story-stream-files-generation/story-stream-files-generation.module';
import { HlsService } from '../../utils/audio/hls.service';

@Module({
  imports: [
    StoriesModule,
    BullModule.registerQueue({ name: QueueName.StoryAudioGeneration }),
    BullBoardModule.forFeature({
      name: QueueName.StoryAudioGeneration,
      adapter: BullMQAdapter,
    }),
    BullModule.registerFlowProducer({
      name: FlowProducerName.StoryAudioGeneration,
    }),
    StorageModule,
    AudioGenerationModule,
    StoryStreamFilesGenerationModule,
  ],
  providers: [StoryAudioGenerationQueue, StoryAudioGenerationJobProcessor, HlsService],
  exports: [StoryAudioGenerationQueue],
})
export class StoryAudioGenerationModule {}
