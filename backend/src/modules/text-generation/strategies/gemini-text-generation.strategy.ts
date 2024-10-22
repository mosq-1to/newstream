import { TextGenerationStrategy } from './text-generation.strategy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiTextGenerationStrategy implements TextGenerationStrategy {
  async prompt(query: string): Promise<string> {
    return `this is your query: ${query}`;
  }
}
