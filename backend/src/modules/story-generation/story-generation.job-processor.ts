import {
  OnQueueEvent,
  Processor,
  QueueEventsListener,
  WorkerHost,
} from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoryGenerationService } from './story-generation.service';
import { SaveArticlesJob } from '../articles/queue/jobs/save-articles.job';
import { Article } from '@prisma/client';
import { StoryGenerationQueue } from './queue/story-generation.queue';
import { GenerateStoryJob } from './queue/jobs/generate-story.job';

@Processor(QueueName.Articles)
@Processor(QueueName.StoryGeneration)
@QueueEventsListener(QueueName.Articles)
export class StoryGenerationJobProcessor extends WorkerHost {
  constructor(
    private readonly storyGenerationService: StoryGenerationService,
    private readonly storyGenerationQueue: StoryGenerationQueue,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  async handleCompletedJob(job: SaveArticlesJob, result: Article[]) {
    switch (job.name) {
      case SaveArticlesJob.name:
        await this.storyGenerationQueue.addGenerateStoryJob(result);
    }
  }

  async process(job: GenerateStoryJob) {
    switch (job.name) {
      case GenerateStoryJob.name:
        return await this.processGenerateStoryJob(job);
    }
  }

  private async processGenerateStoryJob(job: GenerateStoryJob) {
    try {
      return await this.storyGenerationService.generateStoryFromArticle(
        job.data,
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
