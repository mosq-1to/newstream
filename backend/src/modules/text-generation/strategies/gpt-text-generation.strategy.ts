import { TextGenerationStrategy } from './text-generation.strategy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ModelAdvancement } from '../types/model-advancement.type';
import { Logger } from '@nestjs/common';

@Injectable()
export class GptTextGenerationStrategy implements TextGenerationStrategy {
  private readonly client: OpenAI;
  private readonly logger = new Logger(GptTextGenerationStrategy.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateContent(
    prompt: string,
    modelAdvancement: ModelAdvancement = 'nano',
    responseFormat: 'json' | 'text' = 'text',
  ) {
    let model = `gpt-4.1-nano`;
    if (modelAdvancement === 'advanced') {
      model = `gpt-4.1`;
    } else if (modelAdvancement === 'mini') {
      model = `gpt-4.1-mini`;
    }

    const completion = await this.client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format:
        responseFormat === 'json'
          ? {
              type: 'json_object',
            }
          : undefined,
    });

    const result: Record<string, any> | string =
      responseFormat === 'json'
        ? JSON.parse(completion.choices[0].message.content || '{}')
        : completion.choices[0].message.content;

    return { result, modelUsed: model };
  }
}
