import { Job } from 'bullmq';
import { Story } from '@prisma/client';

export class GenerateStoryStreamFilesJob extends Job<{ storyId: Story['id']; isFinal: boolean }> {
  public static getName = (storyId: string) => `generate-story-stream-files-${storyId}`;
}
