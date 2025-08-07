import { Injectable } from '@nestjs/common';
import { Article, Topic } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { Prompt } from '../../text-generation/types/prompt.types';

@Injectable()
export class CategorizeArticleUseCase {
  constructor(private textGenerationService: TextGenerationService) {}

  async execute(topics: Topic[], article: Article): Promise<string | null> {
    const topicsContent = topics
      .map(
        (topic) =>
          `<topic>
        <id>${topic.id}</id>
        <name>${topic.title}</name>
        <description>${topic.description || ''}</description>
      </topic>`,
      )
      .join('\n');

    const result = await this.textGenerationService.usePrompt(
      Prompt.CategorizeArticle,
      {
        variables: { topicsContent, articleTitle: article.title, articleContent: article.content },
        metadata: { articleId: article.id },
      },
      'mini',
    );

    const cleanedResult = result.trim();

    if (cleanedResult === 'null' || cleanedResult === '"null"') {
      return null;
    }

    const isValidTopicId = topics.some((topic) => topic.id === cleanedResult);
    if (!isValidTopicId) {
      throw new Error('[CategorizeArticleUseCase] Invalid topic ID');
    }

    return cleanedResult;
  }
}
