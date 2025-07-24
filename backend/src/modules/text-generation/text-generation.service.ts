import { Injectable } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { ModelAdvancement } from './types/model-advancement.type';
import { PromptTracingService } from '../observability/prompt-tracing.service';

@Injectable()
export class TextGenerationService {
  constructor(
    private readonly textGenerationStrategy: TextGenerationStrategy,
    private readonly promptTracingService: PromptTracingService,
  ) {}

  async generateContent({
    prompt,
    modelAdvancement,
    name,
    metadata,
  }: {
    prompt: string;
    modelAdvancement?: ModelAdvancement;
    name: string;
    metadata?: Record<string, any>;
  }): Promise<{ result: string }> {
    const trace = this.promptTracingService.createTrace({ name });

    trace.update({
      metadata,
      input: prompt,
    });

    const generation = trace.generation({
      input: prompt,
      metadata,
    });

    // Call the strategy to generate content
    const { result, modelUsed } = await this.textGenerationStrategy.generateContent(
      prompt,
      modelAdvancement,
    );

    generation.update({ model: modelUsed });
    generation.end({ output: result });

    trace.update({ output: result });

    return { result };
  }
}
