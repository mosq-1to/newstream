import { Injectable } from '@nestjs/common';
import { StoryGenerationService } from '../story-generation/story-generation.service';
import { Article, Story } from '@prisma/client';
import { StoriesRepository } from './stories.repository';
import { StoriesJobScheduler } from './stories.job-scheduler';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly storyGenerationService: StoryGenerationService,
    private readonly storiesJobScheduler: StoriesJobScheduler,
  ) {}

  async getAllStories() {
    return this.storiesRepository.getAllStories();
  }

  // TODO: Change to getOrGenerateStoryContentById
  async getOrGenerateStoryByArticleId(
    articleId: Article['id'],
  ): Promise<Story> {
    throw new Error('not implemented yet');
    // const story =
    //   await this.storiesRepository.getStoryBySourceArticleId(articleId);
    //
    // if (story) {
    //   return story;
    // }
    //
    // const newStoryData =
    //   await this.storyGenerationService.generateStoryFromArticle(articleId);
    //
    // return await this.storiesRepository.saveStory(newStoryData);
  }

  async addCreateStoriesFromArticlesJob(articles: Article[]) {
    await this.storiesJobScheduler.addCreateStoriesFromArticles(articles);
  }
}
