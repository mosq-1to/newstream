import { Job } from 'bullmq';
import { Article } from '@prisma/client';

export class CreateStoriesFromArticlesJob extends Job {
  data: Article[];

  async process() {
    console.log('Creating stories...');
  }
}
