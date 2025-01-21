import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../text-generation/text-generation.service';
import { Article, Story } from '@prisma/client';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { StoriesService } from '../stories/stories.service';
import { StoryWriteDto } from '../stories/interface/story-write.dto';

@Injectable()
export class StoryGenerationService {
  constructor(
    private readonly textGenerationService: TextGenerationService,
    private readonly storiesService: StoriesService,
  ) {}

  async generateStoryFromArticle(article: Article): Promise<StoryWriteDto> {
    console.log('Generating story from article:', article.id);
    const prompt = new GenerateStoryContentPrompt(article.content);

    try {
      return {
        title: article.title,
        thumbnailUrl: article.thumbnailUrl,
        content: await this.textGenerationService.generateContent(prompt.input),
        sourceArticleId: article.id,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async saveStories(stories: StoryWriteDto[]): Promise<Story[]> {
    return await this.storiesService.saveStories(stories);
  }
}
