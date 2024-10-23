import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../text-generation/text-generation.service';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';
import { Article } from '@prisma/client';
import { StoryWriteDto } from '../stories/stories.repository';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class StoryGenerationService {
  constructor(
    private readonly textGenerationService: TextGenerationService,
    private readonly articlesService: ArticlesService,
  ) {}

  async generateStoryFromArticle(
    articleId: Article['id'],
  ): Promise<StoryWriteDto> {
    const article = await this.articlesService.getArticleById(articleId);
    const prompt = new GenerateStoryContentPrompt(article.content);

    const storyContent = await this.textGenerationService.generateContent(
      prompt.input,
    );

    return {
      title: article.title,
      thumbnailUrl: article.thumbnailUrl,
      content: storyContent,
      sourceArticleId: articleId,
    };
  }
}
