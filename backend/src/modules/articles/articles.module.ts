import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesApi } from './api/articles.api';
import { NewsdataApi } from './api/providers/newsdata/newsdata.api';
import { ArticlesTasks } from './articles.tasks';
import { DatabaseService } from '../../utils/database/database.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    DatabaseService,
    ArticlesService,
    {
      provide: ArticlesApi,
      useClass: NewsdataApi,
    },
    ArticlesTasks,
  ],
})
export class ArticlesModule {}
