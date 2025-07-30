import { Injectable } from '@nestjs/common';
import { BriefsRepository } from './briefs.repository';
import { GenerateBriefUseCase } from './use-cases/generate-brief.use-case';
import { ArticlesRepository } from '../articles/articles.repository';
import { BriefCreateDto } from './interface/brief.create-model';
import { TopicsService } from '../topics/topics.service';

@Injectable()
export class BriefsService {
  constructor(
    private briefsRepository: BriefsRepository,
    private articlesRepository: ArticlesRepository,
    private generateBriefUseCase: GenerateBriefUseCase,
    private topicsService: TopicsService,
  ) {}

  async findAll() {
    return this.briefsRepository.findAll();
  }

  async findOne(id: string) {
    return this.briefsRepository.findOne(id);
  }

  async createBrief(briefCreateDto: BriefCreateDto) {
    const articles = await this.getArticlesForBrief(
      briefCreateDto.topicId,
      briefCreateDto.timeframeInDays,
    );
    const topic = await this.topicsService.findOne(briefCreateDto.topicId);
    const content = await this.generateBriefUseCase.execute(
      articles,
      topic,
      briefCreateDto.lengthInMinutes,
    );
    return this.briefsRepository.saveBrief({
      content,
      articleIds: articles.map((article) => article.id),
      topicId: topic.id,
    });
  }

  private getArticlesForBrief(topicId: string, timeframeInDays: number) {
    const articles = this.articlesRepository.findByTopicId(
      topicId,
      new Date(Date.now() - timeframeInDays * 24 * 60 * 60 * 1000),
    );

    return articles;
  }
}
