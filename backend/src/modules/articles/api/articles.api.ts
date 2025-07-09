import { ArticleReadModel } from "./read-models/article.read-model";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ArticlesApi {
  abstract getArticles(): Promise<ArticleReadModel[]>;
}
