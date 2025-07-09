import { Module } from "@nestjs/common";
import { TextGenerationStrategy } from "./strategies/text-generation.strategy";
import { GeminiTextGenerationStrategy } from "./strategies/gemini-text-generation.strategy";
import { TextGenerationService } from "./text-generation.service";

@Module({
  providers: [
    TextGenerationService,
    {
      provide: TextGenerationStrategy,
      useClass: GeminiTextGenerationStrategy,
    },
  ],
  exports: [TextGenerationService],
})
export class TextGenerationModule {}
