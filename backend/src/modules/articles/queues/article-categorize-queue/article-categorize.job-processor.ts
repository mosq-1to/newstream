import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { ArticlesRepository } from '../../articles.repository';
import { ArticleCategorizeJob } from './article-categorize.job';
import { TopicsService } from 'src/modules/topics/topics.service';
import { CategorizeArticleUseCase } from '../../use-cases/categorize-article.use-case';
import { ArticlesQueuesOrchestratorService } from '../../articles-queues-orchestrator.service';

@Processor(QueueName.ArticleCategorize)
export class ArticleCategorizeJobProcessor extends WorkerHost {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly topicsService: TopicsService,
    private readonly categorizeArticleUseCase: CategorizeArticleUseCase,
    private readonly articlesQueuesOrchestratorService: ArticlesQueuesOrchestratorService,
  ) {
    super();
  }

  async process(job: ArticleCategorizeJob) {
    const { articleId } = job.data;

    const article = await this.articlesRepository.getArticleById(articleId);
    if (!article) throw new Error('[ArticleCategorizeJobProcessor] Article not found');

    const topic = await this.findMatchingTopic(article.title, article.content);

    if (!topic) {
      article.relevant = false;
      await this.articlesRepository.updateArticle(article);
      return;
    }

    article.topicId = topic;
    await this.articlesRepository.updateArticle(article);

    return topic;
  }

  private async findMatchingTopic(title: string, content: string): Promise<string | null> {
    const topics = await this.topicsService.findAll();
    const topicId = await this.categorizeArticleUseCase.execute(topics, title, content);

    return topicId;
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: ArticleCategorizeJob) {
    const article = await this.articlesRepository.getArticleById(job.data.articleId);
    if (!article) throw new Error('[ArticleCategorizeJobProcessor] Article not found');

    await this.articlesQueuesOrchestratorService.onArticleCategorized(article);
  }
}
