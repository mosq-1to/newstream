import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { TopicWriteDto } from './interface/topic-write.dto';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Topic[]> {
    return this.databaseService.topic.findMany({
      include: {
        briefs: true,
      },
    });
  }

  async findOne(id: string): Promise<Topic | null> {
    return this.databaseService.topic.findUnique({
      where: { id },
      include: {
        briefs: true,
      },
    });
  }

  async saveTopic(topic: TopicWriteDto): Promise<Topic> {
    return this.databaseService.topic.create({
      data: {
        title: topic.title,
        thumbnailUrl: topic.thumbnailUrl,
        categoryTitle: topic.categoryTitle,
      },
      include: {
        briefs: true,
      },
    });
  }
}
