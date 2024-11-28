import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoryGenerationModule } from '../story-generation/story-generation.module';
import { StoriesRepository } from './stories.repository';
import { BullModule } from '@nestjs/bullmq';
import { StoriesJobScheduler } from './stories.job-scheduler';
import { StoriesJobProcessor } from './stories.job-processor';
import { QueueName } from '../../types/queue-name.enum';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.Stories }),
    StoryGenerationModule,
  ],
  providers: [
    DatabaseService,
    StoriesService,
    StoriesRepository,
    StoriesJobScheduler,
    StoriesJobProcessor,
  ],
  controllers: [StoriesController],
  exports: [StoriesService],
})
export class StoriesModule {}
