import { Job } from 'bullmq';
import { Brief, User } from '@prisma/client';

export class GenerateBriefAudioJob extends Job<{
  briefId: Brief['id'];
  userId: User['id'];
}> {
  public static getName = (briefId: string) => `generate-brief-audio-${briefId}`;
}

export class GenerateBriefAudioProcessChunkJob extends Job<{
  briefId: Brief['id'];
  userId: User['id'];
  text: string;
  chunkIndex: number;
  /** Timestamp of the last user request */
  lastRequestAt: number;
}> {
  public static getName = (briefId: string, chunkIndex: number) =>
    `generate-brief-audio-${briefId}-process-chunk-${chunkIndex}`;

  public static getNameWithoutChunkIndex = (briefId: string) =>
    `generate-brief-audio-${briefId}-process-chunk-`;
}

export const enum GenerateBriefAutioProcessChunkJobPriority {
  FirstChunk = 0,
  Normal = 1,
  Abandoned = 2,
}
