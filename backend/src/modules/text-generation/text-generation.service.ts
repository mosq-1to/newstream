import { Injectable } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';

@Injectable()
export class TextGenerationService {
  constructor(private readonly textGenerationStrategy: TextGenerationStrategy) {}

  async generateContent(prompt: string): Promise<string> {
    return await this.textGenerationStrategy.generateContent(prompt);
  }
}
