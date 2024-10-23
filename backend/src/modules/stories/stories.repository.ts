import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { Article, Story } from '@prisma/client';

// TODO Move to a separate file
export interface StoryWriteDto {
  title: string;
  thumbnailUrl: string;
  content: string;
  sourceArticleId: string;
}

@Injectable()
export class StoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllStories() {
    return this.databaseService.story.findMany();
  }

  async getStoryBySourceArticleId(articleId: Article['id']) {
    return this.databaseService.story.findUnique({
      where: { sourceArticleId: articleId },
    });
  }

  async saveStory(story: StoryWriteDto): Promise<Story> {
    return this.databaseService.story.create({
      data: story,
    });
  }
}
