import { Injectable } from '@nestjs/common';
import { StoriesRepository, StoryWriteDto } from './stories.repository';

@Injectable()
export class StoriesService {
  constructor(private readonly storiesRepository: StoriesRepository) {}

  async getAllStories() {
    return this.storiesRepository.getAllStories();
  }

  async getStoryById(id: string) {
    return this.storiesRepository.getStoryById(id);
  }

  async saveStories(stories: StoryWriteDto[]) {
    return this.storiesRepository.saveStories(stories);
  }
}
