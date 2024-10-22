import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { StoryGenerationService } from '../story-generation/story-generation.service';

@Injectable()
export class StoriesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storyGenerationService: StoryGenerationService,
  ) {}

  async getAllStories() {
    // For now just returning the articles
    return this.databaseService.article.findMany({});
  }

  // This method is used to get a story by its id. For now it just returns the story directly
  async getStoryById(id: string): Promise<string> {
    const article = await this.databaseService.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new Error('Article not found');
    }
    return this.storyGenerationService.generateStoryFromArticle(article);
  }
}
