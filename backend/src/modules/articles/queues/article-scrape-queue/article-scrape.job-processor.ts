import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { ArticlesRepository } from '../../articles.repository';
import { ScrapeArticleContentUseCase } from '../../use-cases/scrape-article-content.use-case';
import { ArticleScrapeJob } from './article-scrape.job';

@Processor(QueueName.ArticleScrape)
export class ArticleScrapeJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly scrapeArticleContentUseCase: ScrapeArticleContentUseCase,
  ) {
    super();
  }

  async process(job: ArticleScrapeJob) {
    try {
      const { articleId } = job.data;

      const article = await this.articlesRepository.getArticleById(articleId);
      if (!article) throw new Error('[ArticleScrapeJobProcessor] Article not found');

      const content = await this.scrapeArticleContentUseCase.execute(article.url);
      if (!content) throw new Error('[ArticleScrapeJobProcessor] Failed to scrape article content');

      article.content = content;
      await this.articlesRepository.updateArticle(article);

      return content;
    } catch (err) {
      console.error('[ArticleScrapeJobProcessor] Error scraping article content:', err);
    }
  }
}
