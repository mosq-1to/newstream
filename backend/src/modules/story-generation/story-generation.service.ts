import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../text-generation/text-generation.service';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { Article } from '@prisma/client';

@Injectable()
export class StoryGenerationService {
  constructor(private readonly textGenerationService: TextGenerationService) {}

  async generateStoryFromArticle(article: Article): Promise<string> {
    const prompt = new GenerateStoryContentPrompt(article.content);
    return this.textGenerationService.generateContent(prompt.input);
  }
}
