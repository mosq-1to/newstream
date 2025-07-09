import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName } from "../../../types/queue-name.enum";
import { SaveArticlesJob } from "./jobs/save-articles.job";
import { ScrapeArticleJob } from "./jobs/scrape-article.job";
import { ArticlesRepository } from "../articles.repository";
import { ScrapeArticleContentUseCase } from "../use-cases/scrape-article-content.use-case";

@Processor(QueueName.Articles)
export class ArticlesJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly scrapeArticleContentUseCase: ScrapeArticleContentUseCase,
  ) {
    super();
  }

  async process(job: SaveArticlesJob | ScrapeArticleJob) {
    switch (job.name) {
      case SaveArticlesJob.name:
        return await this.processSaveArticlesJob(job as SaveArticlesJob);
      case ScrapeArticleJob.name:
        return await this.processScrapeArticleJob(job as ScrapeArticleJob);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async processSaveArticlesJob(job: SaveArticlesJob) {
    const articles = job.data;
    const savedArticles = await this.articlesRepository.saveArticles(articles);
    console.log(`SaveArticlesJob: Saved ${savedArticles.length} articles`);
    return savedArticles;
  }

  private async processScrapeArticleJob(job: ScrapeArticleJob) {
    const article = job.data;
    try {
      const content = await this.scrapeArticleContentUseCase.execute(
        article.url,
      );
      const updatedArticle = { ...article, content };

      await this.articlesRepository.updateArticle(updatedArticle);
      console.log(
        `ScrapeArticleJob: Successfully scraped content for article ${article.id}`,
      );
      return updatedArticle;
    } catch (error) {
      console.error(
        `ScrapeArticleJob: Failed to scrape article ${article.id}:`,
        error,
      );
      throw error;
    }
  }
}
