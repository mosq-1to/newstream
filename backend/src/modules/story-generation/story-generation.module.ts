import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { StoryGenerationService } from './story-generation.service';

@Module({
  imports: [TextGenerationModule, GenerateStoryContentPrompt],
  providers: [StoryGenerationService],
  exports: [StoryGenerationService],
})
export class StoryGenerationModule {}
