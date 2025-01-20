import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { StoryGenerationService } from './story-generation.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationJobProcessor } from './queue/story-generation.job-processor';
import { StoryGenerationQueue } from './queue/story-generation.queue';
import { ArticlesQueueListener } from './queue/articles.queue-listener';
import { StoryGenerationQueueListener } from './queue/story-generation.queue-listener';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    TextGenerationModule,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullBoardModule.forFeature({
      name: QueueName.Articles,
      adapter: BullMQAdapter,
    }),
    BullModule.registerQueue({ name: QueueName.StoryGeneration }),
    BullBoardModule.forFeature({
      name: QueueName.StoryGeneration,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [
    StoryGenerationQueueListener,
    StoryGenerationService,
    StoryGenerationJobProcessor,
    ArticlesQueueListener,
    StoryGenerationQueue,
  ],
  exports: [],
})
export class StoryGenerationModule {}
