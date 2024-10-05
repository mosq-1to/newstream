import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ArticlesService } from '../modules/articles/articles.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const articlesService = app.get(ArticlesService);

  const articles = await articlesService.getLatestArticles();
  await articlesService.saveArticlesToDatabase(articles);
  await app.close();
}

void bootstrap();
