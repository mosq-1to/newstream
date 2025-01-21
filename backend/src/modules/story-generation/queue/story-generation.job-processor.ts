import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { StoryGenerationService } from '../story-generation.service';
import { GenerateStoryJob } from './jobs/generate-story.job';

@Processor(QueueName.StoryGeneration, { concurrency: 500 })
export class StoryGenerationJobProcessor extends WorkerHost {
  constructor(private readonly storyGenerationService: StoryGenerationService) {
    super();
  }

  async process(job: GenerateStoryJob) {
    switch (job.name) {
      case GenerateStoryJob.name:
        const story =
          await this.storyGenerationService.generateStoryFromArticle(job.data);
        return await this.storyGenerationService.saveStories([story]);
      default:
        throw new Error(
          'StoryGenerationJobProcessor.process(): Unknown job name',
        );
    }
  }
}
