import { Injectable } from '@nestjs/common';
import { BriefsRepository } from './briefs.repository';
import { GenerateBriefUseCase } from './use-cases/generate-brief.use-case';
import { ArticlesRepository } from '../articles/articles.repository';
import { BriefCreateDto } from './interface/brief.create.dto';

@Injectable()
export class BriefsService {
  constructor(
    private briefsRepository: BriefsRepository,
    private articlesRepository: ArticlesRepository,
    private generateBriefUseCase: GenerateBriefUseCase,
  ) { }

  async findAll() {
    return this.briefsRepository.findAll();
  }

  async findOne(id: string) {
    return this.briefsRepository.findOne(id);
  }

  async createBrief(briefCreateDto: BriefCreateDto) {
    const articles = await this.articlesRepository.findByTopicId(briefCreateDto.topicId);
    const briefDto = await this.generateBriefUseCase.execute(articles);
    return this.briefsRepository.saveBrief(briefDto);
  }
}
