import { NewsdataArticleDto } from './dto/newsdata-article.dto';
import {
  ArticleReadModel,
  ArticleSource,
} from '../../read-models/article.read-model';

export const mapNewsdataArticleToArticleReadModel = (
  newsdataArticle: NewsdataArticleDto,
): ArticleReadModel => ({
  sourceId: newsdataArticle.article_id,
  source: ArticleSource.Newsdata,
  title: newsdataArticle.title,
  url: newsdataArticle.link,
  content: newsdataArticle.content,
});
