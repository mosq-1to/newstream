import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { DatabaseService } from '../../utils/database/database.service';
import { HttpModule } from '@nestjs/axios';
import { ArticlesRepository } from './articles.repository';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { ArticlesController } from './articles.controller';
import { ArticlesFetchQueue } from './queues/articles-fetch-queue/articles-fetch.queue';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { FetchArticlesFromApiUseCase } from './use-cases/fetch-articles-from-api.use-case';
import { ArticlesFetchJobProcessor } from './queues/articles-fetch-queue/articles-fetch.job-processor';
import { ScrapeArticleContentUseCase } from './use-cases/scrape-article-content.use-case';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TopicsModule } from '../topics/topics.module';
import { TopicsService } from '../topics/topics.service';
import { ArticleScrapeQueue } from './queues/article-scrape-queue/article-scrape.queue';
import { ArticleScrapeJobProcessor } from './queues/article-scrape-queue/article-scrape.job-processor';
import { ArticleCategorizeQueue } from './queues/article-categorize-queue/article-categorize.queue';
import { ArticleCategorizeJobProcessor } from './queues/article-categorize-queue/article-categorize.job-processor';
import { ArticleTransformQueue } from './queues/article-transform-queue/article-transform.queue';
import { ArticleTransformJobProcessor } from './queues/article-transform-queue/article-transform.job-processor';
import { ArticlesQueuesOrchestratorService } from './articles-queues-orchestrator.service';
import { CategorizeArticleUseCase } from './use-cases/categorize-article.use-case';
import { TransformArticleUseCase } from './use-cases/transform-article.use-case';
import { TextGenerationModule } from '../text-generation/text-generation.module';
import { ObservabilityModule } from '../observability/observability.module';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({ name: QueueName.ArticlesFetch }),
    BullBoardModule.forFeature({
      name: QueueName.ArticlesFetch,
      adapter: BullMQAdapter,
    }),
    BullModule.registerQueue({ name: QueueName.ArticleScrape }),
    BullBoardModule.forFeature({
      name: QueueName.ArticleScrape,
      adapter: BullMQAdapter,
    }),
    BullModule.registerQueue({ name: QueueName.ArticleCategorize }),
    BullBoardModule.forFeature({
      name: QueueName.ArticleCategorize,
      adapter: BullMQAdapter,
    }),
    BullModule.registerQueue({ name: QueueName.ArticleTransform }),
    BullBoardModule.forFeature({
      name: QueueName.ArticleTransform,
      adapter: BullMQAdapter,
    }),
    TopicsModule,
    TextGenerationModule,
    ObservabilityModule,
  ],
  providers: [
    DatabaseService,
    ArticlesService,
    ArticlesRepository,
    ArticlesFetchQueue,
    FetchArticlesUseCase,
    FetchArticlesFromApiUseCase,
    ArticlesFetchJobProcessor,
    ScrapeArticleContentUseCase,
    TopicsService,
    ArticleScrapeQueue,
    ArticleScrapeJobProcessor,
    ArticleCategorizeQueue,
    ArticleCategorizeJobProcessor,
    ArticleTransformQueue,
    ArticleTransformJobProcessor,
    ArticlesQueuesOrchestratorService,
    CategorizeArticleUseCase,
    TransformArticleUseCase,
  ],
  controllers: [ArticlesController],
  exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
