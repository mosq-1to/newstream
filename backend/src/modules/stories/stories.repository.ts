import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { Article, Story } from '@prisma/client';
import { StoryWriteDto } from './interface/story-write.dto';

@Injectable()
export class StoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllStories() {
    return this.databaseService.story.findMany();
  }

  async getStoryById(id: Story['id']) {
    return this.databaseService.story.findUnique({
      where: { id },
    });
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

  async saveStories(stories: StoryWriteDto[]): Promise<Story[]> {
    return this.databaseService.story.createManyAndReturn({
      data: stories,
      skipDuplicates: true,
    });
  }
}
