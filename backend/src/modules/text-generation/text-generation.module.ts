import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { GeminiTextGenerationStrategy } from './strategies/gemini-text-generation.strategy';
import { TextGenerationService } from './text-generation.service';
import { LangfuseService } from './langfuse.service';

@Module({
  imports: [ConfigModule],
  providers: [
    TextGenerationService,
    {
      provide: TextGenerationStrategy,
      useClass: GeminiTextGenerationStrategy,
    },
    LangfuseService,
  ],
  exports: [TextGenerationService],
})
export class TextGenerationModule {}
