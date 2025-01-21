import { Injectable } from '@nestjs/common';
import { StoriesRepository } from './stories.repository';
import { StoryWriteDto } from './interface/story-write.dto';

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

  async streamStoryById(id: string) {
    const story = await this.getStoryById(id);
    return story.content; // Return its content for the time being
  }
}
