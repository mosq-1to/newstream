import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { StoryGenerationService } from '../story-generation.service';
import { GenerateStoryJob } from './jobs/generate-story.job';

@Processor(QueueName.Articles)
@Processor(QueueName.StoryGeneration)
export class StoryGenerationJobProcessor extends WorkerHost {
  constructor(private readonly storyGenerationService: StoryGenerationService) {
    super();
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
