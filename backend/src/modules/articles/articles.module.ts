import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesApi } from './api/articles.api';
import { ArticlesTasks } from './articles.tasks';
import { DatabaseService } from '../../utils/database/database.service';
import { HttpModule } from '@nestjs/axios';
import { NewsdataArticleMapper } from './api/providers/newsdata/newsdata-article.mapper';
import { WorldNewsApi } from './api/providers/worldnewsapi/worldnews.api';
import { WorldNewsArticleMapper } from './api/providers/worldnewsapi/world-news-article.mapper';
import { ArticlesRepository } from './articles.repository';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { ArticlesController } from './articles.controller';
import { ArticlesQueue } from './queue/articles.queue';
import { FetchArticlesUseCase } from './use-cases/fetch-articles.use-case';
import { FetchArticlesFromApiUseCase } from './use-cases/fetch-articles-from-api.use-case';
import { ArticlesJobProcessor } from './queue/articles.job-processor';
import { ScrapeArticleContentUseCase } from './use-cases/scrape-article-content.use-case';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { TopicsModule } from '../topics/topics.module';
import { TopicsService } from '../topics/topics.service';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({ name: QueueName.Articles }),
    BullBoardModule.forFeature({
      name: QueueName.Articles,
      adapter: BullMQAdapter,
    }),
    TopicsModule,
  ],
  providers: [
    DatabaseService,
    ArticlesService,
    ArticlesRepository,
    NewsdataArticleMapper,
    WorldNewsArticleMapper,
    {
      provide: ArticlesApi,
      useClass: WorldNewsApi,
    },
    ArticlesTasks,
    ArticlesQueue,
    FetchArticlesUseCase,
    FetchArticlesFromApiUseCase,
    ArticlesJobProcessor,
    ScrapeArticleContentUseCase,
    TopicsService,
  ],
  controllers: [ArticlesController],
  exports: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
