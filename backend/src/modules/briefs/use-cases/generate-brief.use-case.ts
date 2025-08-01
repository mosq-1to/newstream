import { Injectable, Logger } from '@nestjs/common';
import { Article, Topic } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { Prompt } from 'src/modules/text-generation/types/prompt.types';

@Injectable()
export class GenerateBriefUseCase {
  private readonly logger = new Logger(GenerateBriefUseCase.name);

  constructor(private textGenerationService: TextGenerationService) {}

  async execute(
    articles: Article[],
    topic: Topic,
    userId: string,
  ): Promise<{ content: string; usedArticleIds: string[] }> {
    const articlesContent = articles
      .map(
        (article) =>
          `<article>
        <article_id>${article.id}</article_id>
        <title>${article.title}</title>
        <content>${article.transformedContent}</content>
      </article>`,
      )
      .join('\n');

    const response = await this.textGenerationService.usePrompt(
      Prompt.GenerateBrief,
      {
        variables: {
          articlesContent,
          topicTitle: topic.title,
        },
        metadata: {
          topicId: topic.id,
          articleIds: articles.map((article) => article.id),
          topicTitle: topic.title,
          userId,
        },
      },
      'mini',
      'json',
    );

    this.logger.debug(`Generated brief for topic ${topic.title}: ${JSON.stringify(response)}`);

    if (typeof response === 'string') {
      throw new Error('[GenerateBriefUseCase]: Invalid response format');
    }

    return { content: response.content, usedArticleIds: response.usedArticles };
  }
}
