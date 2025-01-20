import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueName } from '../../../types/queue-name.enum';
import { StoryGenerationService } from '../story-generation.service';
import { GenerateStoryJob } from './jobs/generate-story.job';

@Processor(QueueName.StoryGeneration)
export class StoryGenerationJobProcessor extends WorkerHost {
  constructor(private readonly storyGenerationService: StoryGenerationService) {
    super();
  }

  async process(job: GenerateStoryJob) {
    console.log('Processing job:', job.name);
    switch (job.name) {
      case GenerateStoryJob.name:
        return await this.storyGenerationService.generateStoryFromArticle(
          job.data,
        );
      default:
        throw new Error(
          'StoryGenerationJobProcessor.process(): Unknown job name',
        );
    }
  }
}
