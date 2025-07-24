import { Injectable } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { ModelAdvancement } from './types/model-advancement.type';

@Injectable()
export class TextGenerationService {
  constructor(private readonly textGenerationStrategy: TextGenerationStrategy) {}

  async generateContent(
    prompt: string,
    modelAdvancement?: ModelAdvancement,
  ): Promise<{ result: string; modelUsed: string }> {
    return await this.textGenerationStrategy.generateContent(prompt, modelAdvancement);
  }
}
