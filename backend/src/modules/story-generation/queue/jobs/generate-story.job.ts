import { Job } from 'bullmq';
import { Article } from '@prisma/client';
import { StoryWriteDto } from '../../../stories/interface/story-write.dto';

export class GenerateStoryJob extends Job<Article, StoryWriteDto> {
  public readonly name = 'generate-story';
}
