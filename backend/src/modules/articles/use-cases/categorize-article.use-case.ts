import { Injectable } from '@nestjs/common';
import { Topic } from '@prisma/client';
import { TextGenerationService } from '../../text-generation/text-generation.service';
import { PromptTracingService } from '../../observability/prompt-tracing.service';

@Injectable()
export class CategorizeArticleUseCase {
  constructor(
    private textGenerationService: TextGenerationService,
    private readonly promptTracingService: PromptTracingService,
  ) {}

  async execute(
    topics: Topic[],
    articleTitle: string,
    articleContent: string,
  ): Promise<string | null> {
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

    const prompt = `
      You are a highly precise content categorization system. Your task is to analyze an article and determine which topic it best matches from a provided list of topics. If the article is irrelevant (such as how-to guides, rankings, or listicles), you should indicate so.

      <topics>
        ${topicsContent}
      </topics>

      <article>
        <title>${articleTitle}</title>
        <content>${articleContent}</content>
      </article>

      <rules>
        - Analyze the article content and title to understand its main subject matter.
        - Match the article with the most appropriate topic from the provided list based on semantic relevance.
        - Articles about rankings, lists (e.g., "Top 10", "Best 5"), how-to guides, or instructional content should be marked as irrelevant.
        - If the article doesn't clearly match any of the provided topics, consider it irrelevant.
        - Do not guess or force a match if there isn't a clear connection between the article and a topic.
        - The article should be substantially about the topic, not just mentioning it in passing.
        - If the article content doesn't match any of the provided topics, consider it irrelevant.
      </rules>

      <output_format>
        If the article matches a topic, respond ONLY with the topic ID.
        If the article is irrelevant or doesn't match any topic well, respond ONLY with "null".
        DO NOT include any explanations, justifications, or additional text beyond the topic ID or "null".
      </output_format>
      `;

    const trace = this.promptTracingService.createTrace({ name: 'categorize-article' });
    const span = trace.span({ name: 'categorize-article' });

    const result = await this.textGenerationService.generateContent(prompt);

    span.update({ input: prompt, output: result });
    const cleanedResult = result.trim();

    if (cleanedResult === 'null' || cleanedResult === '"null"') {
      span.end();
      return null;
    }

    const isValidTopicId = topics.some((topic) => topic.id === cleanedResult);
    if (!isValidTopicId) {
      span.update({ statusMessage: 'Invalid topic ID' });
      span.end();
      throw new Error('[CategorizeArticleUseCase] Invalid topic ID');
    }

    return cleanedResult;
  }
}
