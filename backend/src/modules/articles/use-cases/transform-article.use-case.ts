import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { Prompt } from 'src/modules/text-generation/types/prompt.types';
import { Article } from '@prisma/client';

@Injectable()
export class TransformArticleUseCase {
  constructor(private textGenerationService: TextGenerationService) {}

  async execute(article: Article): Promise<string> {
    const result = await this.textGenerationService.usePrompt(Prompt.TransformArticle, {
      variables: { articleTitle: article.title, articleContent: article.content },
      metadata: { articleId: article.id },
    });

    return result;
  }
}
