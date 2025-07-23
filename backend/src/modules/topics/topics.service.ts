import { Injectable } from '@nestjs/common';
import { TopicsRepository } from './topics.repository';
import { TopicWriteDto } from './interface/topic-write.dto';

@Injectable()
export class TopicsService {
  constructor(private topicsRepository: TopicsRepository) {}

  async findAll() {
    return this.topicsRepository.findAll();
  }

  async findOne(id: string) {
    return this.topicsRepository.findOne(id);
  }

  async createTopic(topic: TopicWriteDto) {
    return this.topicsRepository.saveTopic(topic);
  }

  async getAllKeywords() {
    const topics = await this.topicsRepository.findAll();
    return topics.map((topic) => topic.keywords).flat();
  }
}
