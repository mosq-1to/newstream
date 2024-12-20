import { Processor, WorkerHost } from '@nestjs/bullmq';
import { StoriesGeneratedJob } from './jobs/stories-generated.job';
import { StoriesService } from './stories.service';
import { QueueName } from '../../types/queue-name.enum';

@Processor(QueueName.StoryGeneration)
export class StoriesQueueProcessor extends WorkerHost {
  constructor(private readonly storiesService: StoriesService) {
    super();
  }

  async process(job: StoriesGeneratedJob) {
    switch (job.name) {
      case StoriesGeneratedJob.name:
        await this.processStoriesGeneratedJob(job);
        break;
    }
  }

  private async processStoriesGeneratedJob(job: StoriesGeneratedJob) {
    const stories = job.data;
    const result = await this.storiesService.saveStories(stories);
    console.log(`CreateStoriesJob: Saved ${result.length} stories`);
  }
}
