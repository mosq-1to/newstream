import { Job } from "bullmq";
import { ArticleWriteDto } from "../../interface/article-write.dto";
import { Article } from "@prisma/client";

export class SaveArticlesJob extends Job<ArticleWriteDto[], Article[]> {
  public readonly name = "save-articles";
}
