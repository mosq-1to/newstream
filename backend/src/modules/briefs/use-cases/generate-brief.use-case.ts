import { Injectable } from "@nestjs/common";
import { Article } from "@prisma/client";
import { TextGenerationService } from "../../text-generation/text-generation.service";
import { BriefWriteDto } from "../interface/brief-write.dto";

@Injectable()
export class GenerateBriefUseCase {
  constructor(private textGenerationService: TextGenerationService) {}

  async execute(articles: Article[]): Promise<BriefWriteDto> {
    const articlesContent = articles
      .map(
        (article) =>
          `<article>
        <title>${article.title}</title>
        <content>${article.content}</content>
      </article>`
      )
      .join("\n");

    const prompt = `
      You are a world-class news analyst and summarizer. Your task is to analyze the following content, which consists of multiple news articles and reports, and generate a brief, clear summary of the most important global events. Focus on time-sensitive news

      <articles>
        ${articlesContent}
      </articles>

      <rules>
        - Only include essential news stories that are clearly current and relevant to the topic.
        - Omit local, entertainment, lifestyle, or speculative content unless it’s necessary for context or strictly related to the topic.
        - If multiple sources mention the same event, summarize them together without repetition.
        - Keep your tone neutral and factual.
        - Aim for maximum clarity and brevity.
        - Assume the reader has limited time and wants to quickly understand what matters most in the world right now.
        - Do not use any markdown features such as headings or text boldings.
        - Do not use any symbols for emphasis or structure.
        - If article seems not relevant to the topic or its content seems broken or invalid, skip it.
      </rules>

      Topic of the brief is ${"Artificial Intelligence"}, so focus on it while analyzing the articles. Avoid any other not relevant topics.

      <objective>
        Generate a concise brief summarizing the articles. Include only the most important data and events from each relevant article.
      </objective>
      `;

    const content = await this.textGenerationService.generateContent(prompt);

    return {
      content,
      articleIds: articles.map((article) => article.id),
      // todo - hardcoded for now. make it dynamic later on
      topicId: "1b5831a4-a72d-4abe-9d4e-7c5bcf592c28",
    };
  }
}
