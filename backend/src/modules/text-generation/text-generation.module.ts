import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TextGenerationStrategy } from './strategies/text-generation.strategy';
import { TextGenerationService } from './text-generation.service';
import { GptTextGenerationStrategy } from './strategies/gpt-text-generation.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    TextGenerationService,
    {
      provide: TextGenerationStrategy,
      useClass: GptTextGenerationStrategy,
    },
  ],
  exports: [TextGenerationService],
})
export class TextGenerationModule {}
