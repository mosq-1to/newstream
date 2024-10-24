import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Queues } from '../../types/queues.enum';
import { StoriesRepository } from './stories.repository';
import { CreateStoriesFromArticlesJob } from './jobs/create-stories-from-articles.job';
import { mapArticleToStoryWriteDto } from './mappers/map-article-to-story-write-dto';

@Processor(Queues.STORIES_QUEUE)
export class StoriesJobProcessor extends WorkerHost {
  constructor(private readonly storiesRepository: StoriesRepository) {
    super();
  }

  async process(job: CreateStoriesFromArticlesJob) {
    switch (job.name) {
      case CreateStoriesFromArticlesJob.name:
        await this.processCreateStoriesJob(job);
        break;
    }
  }

  private async processCreateStoriesJob(job: CreateStoriesFromArticlesJob) {
    const stories = job.data.map(mapArticleToStoryWriteDto);
    const result = await this.storiesRepository.saveStories(stories);
    console.log(`CreateStoriesJob: Saved ${result.length} stories`);
  }
}
