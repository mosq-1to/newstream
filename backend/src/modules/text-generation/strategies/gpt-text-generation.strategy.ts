import { TextGenerationStrategy } from './text-generation.strategy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ModelAdvancement } from '../types/model-advancement.type';

@Injectable()
export class GptTextGenerationStrategy implements TextGenerationStrategy {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateContent(
    prompt: string,
    modelAdvancement: ModelAdvancement = 'mini',
  ): Promise<string> {
    let model = `gpt-4.1-mini`;
    if (modelAdvancement === 'advanced') {
      model = `gpt-o3`;
    }

    const completion = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content || '';
  }
}
