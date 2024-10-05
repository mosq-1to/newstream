import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';

@Injectable()
export class StoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllStories() {
    // For now just returning the articles
    return this.databaseService.article.findMany({});
  }
}
