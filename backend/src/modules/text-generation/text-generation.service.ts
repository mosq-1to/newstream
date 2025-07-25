import { Injectable } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { ModelAdvancement } from './types/model-advancement.type';
import { PromptTracingService } from '../observability/prompt-tracing.service';
import { PromptVariables } from './types/prompt.types';

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
  }): Promise<string> {
    const trace = this.promptTracingService.createTrace({ name });

    trace.update({
      metadata,
      input: prompt,
    });

    const generation = trace.generation({
      input: prompt,
      metadata,
    });

    const { result, modelUsed } = await this.textGenerationStrategy.generateContent(
      prompt,
      modelAdvancement,
    );

    generation.update({ model: modelUsed });
    generation.end({ output: result });
    trace.update({ output: result });

    return result;
  }

  async usePrompt<T extends keyof PromptVariables>(
    promptName: T,
    {
      variables,
      metadata,
    }: {
      variables: PromptVariables[T];
      metadata?: Record<string, any>;
    },
    modelAdvancement?: ModelAdvancement,
  ) {
    const trace = this.promptTracingService.createTrace({ name: promptName });

    const prompt = await this.promptTracingService.getPrompt(promptName);
    const compiledPrompt = prompt.compile(variables);

    const generation = trace.generation({
      input: compiledPrompt,
      metadata,
      prompt,
    });

    trace.update({
      metadata,
      input: compiledPrompt,
    });

    const { result, modelUsed } = await this.textGenerationStrategy.generateContent(
      compiledPrompt,
      modelAdvancement,
    );

    generation.update({ model: modelUsed });
    generation.end({ output: result });
    trace.update({ output: result });

    return result;
  }
}
