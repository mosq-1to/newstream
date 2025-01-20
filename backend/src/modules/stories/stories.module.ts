import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoryGenerationModule } from '../story-generation/story-generation.module';
import { StoriesRepository } from './stories.repository';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.StoryGeneration }),
    StoryGenerationModule,
  ],
  providers: [DatabaseService, StoriesService, StoriesRepository],
  controllers: [StoriesController],
  exports: [StoriesService],
})
export class StoriesModule {}
