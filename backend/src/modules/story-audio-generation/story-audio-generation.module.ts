import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FlowProducerName } from '../../types/flow-producer.enum';
import { StoryAudioGenerationQueue } from './story-audio-generation.queue';
import { StoriesModule } from '../stories/stories.module';

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
  ],
  providers: [StoryAudioGenerationQueue],
  exports: [StoryAudioGenerationQueue],
})
export class StoryAudioGenerationModule {}
