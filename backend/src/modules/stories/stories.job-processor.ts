import { Processor, WorkerHost } from '@nestjs/bullmq';
import { StoriesRepository } from './stories.repository';
import { StoriesGeneratedJob } from './jobs/stories-generated.job';
import { QueueName } from 'src/types/queue-name.enum';

@Processor(QueueName.Stories)
export class StoriesJobProcessor extends WorkerHost {
  constructor(private readonly storiesRepository: StoriesRepository) {
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
    const result = await this.storiesRepository.saveStories(stories);
    console.log(`CreateStoriesJob: Saved ${result.length} stories`);
  }
}
