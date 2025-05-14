import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { BriefWriteDto } from '../interface/brief-write.dto';

@Injectable()
export class GenerateBriefUseCase {
  constructor(private textGenerationService: TextGenerationService) { }

  async execute(articles: Article[]): Promise<BriefWriteDto> {
    const articlesContent = articles.map(article =>
      `<article>
        <title>${article.title}</title>
        <content>${article.content}</content>
      </article>`
    ).join('\n');

    const prompt = `
      <objective>
        Generate a concise brief summarizing the following articles. Include the most important points and create a title that captures the theme of these articles.
      </objective>

      <articles>
        ${articlesContent}
      </articles>

      <rules>
        - Avoid using any symbols for emphasis or structure. Do not use any markdown features such as headings or text boldings.
      </rules>
      `;

    const content = await this.textGenerationService.generateContent(prompt);

    return {
      content,
      articleIds: articles.map(article => article.id),
    };
  }
}
