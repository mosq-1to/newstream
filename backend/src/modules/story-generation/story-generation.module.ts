import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { StoryGenerationService } from './story-generation.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationProcessor } from './story-generation.processor';

@Module({
  imports: [
    TextGenerationModule,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullModule.registerQueue({ name: QueueName.StoryGeneration }),
  ],
  providers: [StoryGenerationService, StoryGenerationProcessor],
  exports: [],
})
export class StoryGenerationModule {}
