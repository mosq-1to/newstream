import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesApi } from './api/articles.api';
import { NewsdataApi } from './api/providers/newsdata/newsdata.api';

@Module({
  providers: [
    ArticlesService,
    {
      provide: ArticlesApi,
      useClass: NewsdataApi,
    },
  ],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
