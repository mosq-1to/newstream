import { ModelAdvancement } from '../types/model-advancement.type';

export abstract class TextGenerationStrategy {
  abstract generateContent(
    prompt: string,
    modelAdvancement?: ModelAdvancement,
    responseFormat?: 'json' | 'text',
  ): Promise<{ result: string | Record<string, any>; modelUsed: string }>;
}
