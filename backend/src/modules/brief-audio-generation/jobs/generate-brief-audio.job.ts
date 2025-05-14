import { Job } from 'bullmq';
import { Brief } from '@prisma/client';

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
