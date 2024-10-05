import { NewsdataArticleDto } from './newsdata-article.dto';
import { ArticleReadModel } from '../../read-models/article.read-model';

export const mapNewsdataArticleToArticleReadModel = (
  newsdataArticle: NewsdataArticleDto,
): ArticleReadModel => ({
  id: newsdataArticle.article_id,
  title: newsdataArticle.title,
  url: newsdataArticle.link,
  content: newsdataArticle.content,
});
