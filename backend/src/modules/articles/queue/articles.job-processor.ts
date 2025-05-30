import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { SaveArticlesJob } from './jobs/save-articles.job';
import { ArticlesRepository } from '../articles.repository';

@Processor(QueueName.Articles)
export class ArticlesJobProcessor extends WorkerHost {
  constructor(private readonly articlesRepository: ArticlesRepository) {
    super();
  }

  async process(job: SaveArticlesJob) {
    switch (job.name) {
      case SaveArticlesJob.name:
        return await this.processSaveArticlesJob(job);
    }
  }

  private async processSaveArticlesJob(job: SaveArticlesJob) {
    const articles = job.data;
    const savedArticles = await this.articlesRepository.saveArticles(articles);
    console.log(`SaveArticlesJob: Saved ${savedArticles.length} articles`);
    return savedArticles;
  }
}
