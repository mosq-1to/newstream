import { Job } from "bullmq";
import { Article } from "@prisma/client";

export class ScrapeArticleJob extends Job<Article, Article> {
  public readonly name = "scrape-article";
}
