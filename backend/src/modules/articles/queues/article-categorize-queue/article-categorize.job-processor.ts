import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../../types/queue-name.enum';
import { ArticlesRepository } from '../../articles.repository';
import { ArticleCategorizeJob } from './article-categorize.job';

@Processor(QueueName.ArticleCategorize)
export class ArticleCategorizeJobProcessor extends WorkerHost {
  constructor(private readonly articlesRepository: ArticlesRepository) {
    super();
  }

  async process(job: ArticleCategorizeJob) {
    const { articleId } = job.data;

    const article = await this.articlesRepository.getArticleById(articleId);
    if (!article) throw new Error('[ArticleCategorizeJobProcessor] Article not found');

    const isIrrelevant = this.isIrrelevantArticle(article.title, article.content);

    if (isIrrelevant) {
      article.relevant = false;
      await this.articlesRepository.updateArticle(article);
      return;
    }

    const topic = await this.findMatchingTopic(article.title, article.content);

    if (topic) {
      article.topicId = topic;
      await this.articlesRepository.updateArticle(article);
    }

    return topic;
  }

  private isIrrelevantArticle(title: string, content: string): boolean {
    const irrelevantPatterns = [/top\s+\d+/i, /ranking/i, /how\s+to/i, /guide/i, /best\s+\d+/i];

    return irrelevantPatterns.some(
      (pattern) => pattern.test(title) || (content && pattern.test(content)),
    );
  }

  private async findMatchingTopic(_title: string, _content: string) {
    return '';
  }
}
