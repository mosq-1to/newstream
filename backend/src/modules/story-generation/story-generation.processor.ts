import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationService } from './story-generation.service';
import { ArticlesCreatedJob } from '../articles/jobs/articles-created.job';

@Processor(QueueName.Articles)
export class StoryGenerationProcessor extends WorkerHost {
  constructor(private readonly storyGenerationService: StoryGenerationService) {
    super();
  }

  async process(job: ArticlesCreatedJob) {
    switch (job.name) {
      case ArticlesCreatedJob.name:
        await this.processArticlesCreatedJob(job);
        break;
    }
  }

  private async processArticlesCreatedJob(job: ArticlesCreatedJob) {
    const articles = job.data;
    const stories = await Promise.all(
      articles.map((article) =>
        this.storyGenerationService.generateStoryFromArticle(article),
      ),
    );
    void this.storyGenerationService.emitStoriesGeneratedJob(stories);
  }
}
