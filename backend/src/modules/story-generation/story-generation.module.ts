import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { StoryGenerationService } from './story-generation.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';

@Module({
  imports: [
    TextGenerationModule,
    GenerateStoryContentPrompt,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullModule.registerQueue({ name: QueueName.Stories }),
  ],
  providers: [StoryGenerationService],
  exports: [StoryGenerationService],
})
export class StoryGenerationModule {}
