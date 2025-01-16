import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { StoryGenerationService } from './story-generation.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationJobProcessor } from './queue/story-generation.job-processor';
import { StoryGenerationQueue } from './queue/story-generation.queue';
import { ArticlesQueueListener } from './queue/articles.queue-listener';

@Module({
  imports: [
    TextGenerationModule,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullModule.registerQueue({ name: QueueName.StoryGeneration }),
  ],
  providers: [
    StoryGenerationService,
    StoryGenerationJobProcessor,
    ArticlesQueueListener,
    StoryGenerationQueue,
  ],
  exports: [],
})
export class StoryGenerationModule {}
