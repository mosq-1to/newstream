import { Injectable } from '@nestjs/common';
import { StoryGenerationService } from '../story-generation/story-generation.service';
import { Article, Story } from '@prisma/client';
import { StoriesRepository } from './stories.repository';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly storyGenerationService: StoryGenerationService,
  ) {}

  async getAllStories() {
    return this.storiesRepository.getAllStories();
  }

  async getOrGenerateStoryByArticleId(
    articleId: Article['id'],
  ): Promise<Story> {
    const story =
      await this.storiesRepository.getStoryBySourceArticleId(articleId);

    if (story) {
      return story;
    }

    const newStoryData =
      await this.storyGenerationService.generateStoryFromArticle(articleId);

    return await this.storiesRepository.saveStory(newStoryData);
  }
}
