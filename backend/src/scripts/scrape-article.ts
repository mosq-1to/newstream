const url = process.argv[2];

// void import('@extractus/article-extractor').then(
//   async ({ extract, setSanitizeHtmlOptions }) => {
//     setSanitizeHtmlOptions({ allowedTags: [], allowedAttributes: [] });
//
//     try {
//       const article = await extract(url);
//       console.log(
//         `Articles content: ${JSON.stringify(article.content, null, 2)}`,
//       );
//     } catch (e) {
//       console.error(
//         'Cannot get article content: ' + JSON.stringify(e, null, 2),
//       );
//     }
//     // eslint-disable-next-line promise/no-return-wrap
//     return Promise.resolve();
//   },
// );

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ArticleScrapingService } from '../modules/articles/scraping/article-scraping.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const extractorScrapingStrategy = app.get(ArticleScrapingService);

  const article = await extractorScrapingStrategy.scrapeArticleContent(url);
  console.log(`Articles content: ${JSON.stringify(article, null, 2)}`);
  await app.close();
}

void bootstrap();
