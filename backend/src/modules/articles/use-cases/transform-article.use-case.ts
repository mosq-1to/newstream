import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../../text-generation/text-generation.service';

@Injectable()
export class TransformArticleUseCase {
  constructor(private textGenerationService: TextGenerationService) {}

  async execute(articleTitle: string, articleContent: string): Promise<string> {
    const prompt = `
      You are a highly skilled content transformer and enhancer. Your task is to transform an article into a well-structured format that can be effectively used by other language models for summarization and analysis.

      <article>
        <title>${articleTitle}</title>
        <content>${articleContent}</content>
      </article>

      <rules>
        - Remove any repetitive content or redundant information
        - Maintain the core message and important details of the article
        - Ensure factual accuracy and maintain the original tone
        - Keep important quotes intact along with their attribution
        - Preserve key statistics, data points, and research findings
        - Extract the most important takeaways from the article
        - Don't put any formatting in the response, just mere tags and plain text
        - Don't put any additional information, just the response
        - Don't structurize the output, it has to be in plain text
        - Beware that the content can contains some text that is not related to the article, for example navigation bar items, sidebars, etc. Remove them and focus only on the article content.
      </rules>

      <output_format>
        Provide your response in the following clearly defined sections:

        <key_takeaways>
        List 3-5 bullet points that capture the most important insights from the article.
        </key_takeaways>

        <notable_quotes>
        Include 2-4 significant quotes from the article, along with the name of the person who said them.
        Format: "Quote text." - Author/Speaker
        </notable_quotes>

        <important_ideas>
        Highlight 2-4 noteworthy concepts, arguments, or perspectives presented in the article.
        </important_ideas>

        <summary>
        Provide a concise summary (250-400 words) of the article that captures its essence while eliminating redundancies.
        </summary>
      </output_format>
      `;

    return await this.textGenerationService.generateContent(prompt);
  }
}
