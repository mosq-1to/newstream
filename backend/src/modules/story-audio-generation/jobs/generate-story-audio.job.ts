import { Job } from 'bullmq';
import { Story } from '@prisma/client';

export class GenerateStoryAudioJob extends Job<{ storyId: Story['id'] }> {
  public static getName = (storyId: string) =>
    `generate-story-audio-${storyId}`;
}

export class GenerateStoryAudioProcessChunkJob extends Job<{
  storyId: Story['id'];
  text: string;
  chunkIndex: number;
}> {
  public static getName = (storyId: string, chunkIndex: number) =>
    `generate-story-audio-${storyId}-process-chunk-${chunkIndex}`;
}
