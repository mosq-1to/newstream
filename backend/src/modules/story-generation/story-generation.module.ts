import { Module } from '@nestjs/common';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { StoryGenerationService } from './story-generation.service';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [TextGenerationModule, GenerateStoryContentPrompt, ArticlesModule],
  providers: [StoryGenerationService],
  exports: [StoryGenerationService],
})
export class StoryGenerationModule {}
