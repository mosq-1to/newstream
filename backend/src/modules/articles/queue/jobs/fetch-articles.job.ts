import { Job } from 'bullmq';

export class FetchArticlesJob extends Job<void, void> {
  public readonly name = 'fetch-articles';
}
