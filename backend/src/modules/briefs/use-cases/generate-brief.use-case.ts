import { Injectable } from '@nestjs/common';
import { Article, Topic } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { Prompt } from 'src/modules/text-generation/types/prompt.types';

@Injectable()
export class GenerateBriefUseCase {
  constructor(private textGenerationService: TextGenerationService) {}

  async execute(articles: Article[], topic: Topic, lengthInMinutes: number): Promise<string> {
    const articlesContent = articles
      .map(
        (article) =>
          `<article>
        <title>${article.title}</title>
        <content>${article.transformedContent}</content>
      </article>`,
      )
      .join('\n');

    const content = await this.textGenerationService.usePrompt(
      Prompt.GenerateBrief,
      {
        variables: {
          articlesContent,
          topicTitle: topic.title,
          desiredWordsCount: (lengthInMinutes * 130).toString(),
        },
        metadata: {
          topicId: topic.id,
          articleIds: articles.map((article) => article.id),
          topicTitle: topic.title,
        },
      },
      'mini',
    );

    return content;
  }
}
