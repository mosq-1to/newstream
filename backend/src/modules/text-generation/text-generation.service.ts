import { Injectable } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';

@Injectable()
export class TextGenerationService {
  constructor(
    private readonly textGenerationStrategy: TextGenerationStrategy,
  ) {}

  async generateText(query: string): Promise<string> {
    return await this.textGenerationStrategy.prompt(query);
  }
}
