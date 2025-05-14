import { Job } from 'bullmq';

// Type definition until Prisma client is regenerated
type Brief = {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class GenerateBriefAudioJob extends Job<{ briefId: Brief['id'] }> {
  public static getName = (briefId: string) =>
    `generate-brief-audio-${briefId}`;
}

export class GenerateBriefAudioProcessChunkJob extends Job<{
  briefId: Brief['id'];
  text: string;
  chunkIndex: number;
}> {
  public static getName = (briefId: string, chunkIndex: number) =>
    `generate-brief-audio-${briefId}-process-chunk-${chunkIndex}`;
}
