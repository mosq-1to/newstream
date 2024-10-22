import { Module } from '@nestjs/common';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { GeminiTextGenerationStrategy } from './strategies/gemini-text-generation.strategy';

@Module({
  providers: [
    {
      provide: TextGenerationStrategy,
      useClass: GeminiTextGenerationStrategy,
    },
  ],
})
export class TextGenerationModule {}
