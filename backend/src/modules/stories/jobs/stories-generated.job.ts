import { Job } from 'bullmq';
import { StoryWriteDto } from '../stories.repository';

export class StoriesGeneratedJob extends Job {
  public readonly data: StoryWriteDto[];

  public readonly name = 'stories-generated';
}
