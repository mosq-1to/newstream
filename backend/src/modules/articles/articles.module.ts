import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesTasks } from './articles.tasks';
import { DatabaseService } from '../../utils/database/database.service';
import { HttpModule } from '@nestjs/axios';
import { ArticlesRepository } from './articles.repository';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { ArticlesController } from './articles.controller';
import { ArticlesFetchQueue } from './queues/articles-fetch-queue/articles-fetch.queue';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { FetchArticlesFromApiUseCase } from './use-cases/fetch-articles-from-api.use-case';
import { ArticlesJobProcessor } from './queues/articles-fetch-queue/articles-fetch.job-processor';
import { ScrapeArticleContentUseCase } from './use-cases/scrape-article-content.use-case';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TopicsModule } from '../topics/topics.module';
import { TopicsService } from '../topics/topics.service';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({ name: QueueName.ArticlesFetch }),
    BullBoardModule.forFeature({
      name: QueueName.ArticlesFetch,
      adapter: BullMQAdapter,
    }),
    TopicsModule,
  ],
  providers: [
    DatabaseService,
    ArticlesService,
    ArticlesRepository,
    ArticlesTasks,
    ArticlesFetchQueue,
    FetchArticlesUseCase,
    FetchArticlesFromApiUseCase,
    ArticlesJobProcessor,
    ScrapeArticleContentUseCase,
    TopicsService,
    ArticlesFetchQueue,
  ],
  controllers: [ArticlesController],
  exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
