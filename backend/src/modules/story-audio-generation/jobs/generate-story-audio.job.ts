import { Job } from 'bullmq';
import { Story } from '@prisma/client';

export class GenerateStoryAudioJob extends Job<{ storyId: Story['id'] }> {
  public readonly name = 'generate-story-audio';
}

export class GenerateStoryAudioProcessChunkJob extends Job<{
  storyId: Story['id'];
  text: string;
  chunkIndex: number;
}> {
  public readonly name = 'generate-story-audio-process-chunk';
}
