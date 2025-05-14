import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { BriefWriteDto } from '../interface/brief-write.dto';

@Injectable()
export class GenerateBriefUseCase {
  constructor(private textGenerationService: TextGenerationService) { }

  async execute(articles: Article[]): Promise<BriefWriteDto> {
    // Prepare article content for prompt
    const articlesContent = articles.map(article =>
      `Title: ${article.title}\nContent: ${article.content || 'No content available'}`
    ).join('\n\n');

    // Create prompt for Gemini
    const prompt = `Generate a concise brief summarizing the following articles. Include the most important points and create a title that captures the theme of these articles.\n\n${articlesContent}`;

    const completion = await this.textGenerationService.generateContent(prompt);

    // Parse the response - assuming format has title and content
    const lines = completion.split('\n');
    const title = lines[0].startsWith('Title:') ? lines[0].substring(6).trim() : lines[0].trim();
    const content = lines.slice(1).join('\n').trim();

    return {
      title,
      content,
      articleIds: articles.map(article => article.id),
    };
  }
}
