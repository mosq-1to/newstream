import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationService } from './story-generation.service';
import { ArticlesCreatedJob } from '../articles/queue/jobs/articles-created.job';

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
    for (const articles of job.data) {
      try {
        const story =
          await this.storyGenerationService.generateStoryFromArticle(articles);
        void this.storyGenerationService.emitStoriesGeneratedJob([story]);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }
}
