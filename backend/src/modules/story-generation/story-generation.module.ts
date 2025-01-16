import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { StoryGenerationService } from './story-generation.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationJobProcessor } from './queue/story-generation.job-processor';
import { StoryGenerationQueue } from './queue/story-generation.queue';
import { StoryGenerationQueueListener } from './queue/story-generation.queue-listener';

@Module({
  imports: [
    TextGenerationModule,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullModule.registerQueue({ name: QueueName.StoryGeneration }),
  ],
  providers: [
    StoryGenerationService,
    StoryGenerationJobProcessor,
    StoryGenerationQueueListener,
    StoryGenerationQueue,
  ],
  exports: [],
})
export class StoryGenerationModule {}
