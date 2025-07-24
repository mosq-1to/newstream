import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromptTracingService } from './prompt-tracing.service';

@Module({
  imports: [ConfigModule],
  providers: [PromptTracingService],
  exports: [PromptTracingService],
})
export class ObservabilityModule {}
