import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../text-generation/text-generation.service';
import { Article } from '@prisma/client';
import { StoryWriteDto } from '../stories/stories.repository';

@Injectable()
export class StoryGenerationService {
  constructor(private readonly textGenerationService: TextGenerationService) {}

  async generateStoryFromArticle(
    articleId: Article['id'],
  ): Promise<StoryWriteDto> {
    throw new Error('not implementedyet');
    // const article = await this.articlesService.getArticleById(articleId);
    // const prompt = new GenerateStoryContentPrompt(article.content);
    //
    // const storyContent = await this.textGenerationService.generateContent(
    //   prompt.input,
    // );
    //
    // return {
    //   title: article.title,
    //   thumbnailUrl: article.thumbnailUrl,
    //   content: storyContent,
    //   sourceArticleId: articleId,
    // };
  }
}
