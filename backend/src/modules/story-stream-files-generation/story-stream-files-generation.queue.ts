import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateStoryStreamFilesJob } from './jobs/generate-story-stream-files.job';
import { QueueName } from '../../types/queue-name.enum';

@Injectable()
export class StoryStreamFilesGenerationQueue {
  constructor(
    @InjectQueue(QueueName.StoryStreamFilesGeneration)
    private readonly storyStreamFilesGenerationQueue: Queue,
  ) {}

  async addGenerateStoryStreamFilesJob(storyId: string, isFinal: boolean) {
    return await this.storyStreamFilesGenerationQueue.add(
      GenerateStoryStreamFilesJob.getName(storyId),
      {
        storyId,
        isFinal,
      },
      {
        deduplication: { id: `${storyId}-${isFinal}` },
      },
    );
  }
}
