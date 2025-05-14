import { Injectable } from '@nestjs/common';
import { BriefsRepository } from './briefs.repository';
import { GenerateBriefUseCase } from './use-cases/generate-brief.use-case';
import { ArticlesRepository } from '../articles/articles.repository';

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

  async createBrief(articleIds: string[]) {
    // Fetch the articles
    const articles = await this.articlesRepository.findByIds(articleIds);

    // Generate brief using Gemini
    const briefDto = await this.generateBriefUseCase.execute(articles);

    // Save the brief
    return this.briefsRepository.saveBrief(briefDto);
  }
}
