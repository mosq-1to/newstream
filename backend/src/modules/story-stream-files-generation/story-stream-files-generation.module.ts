import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { StoryStreamFilesGenerationQueue } from './story-stream-files-generation.queue';
import { StoryStreamFilesGenerationJobProcessor } from './story-stream-files-generation.job-processor';
import { StorageModule } from '../storage/storage.module';
import { HlsService } from '../../utils/audio/hls.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.StoryStreamFilesGeneration,
      defaultJobOptions: {
        lifo: true, // Last In First Out
      },
    }),
    BullBoardModule.forFeature({
      name: QueueName.StoryStreamFilesGeneration,
      adapter: BullMQAdapter,
    }),
    StorageModule,
  ],
  providers: [StoryStreamFilesGenerationQueue, StoryStreamFilesGenerationJobProcessor, HlsService],
  exports: [StoryStreamFilesGenerationQueue],
})
export class StoryStreamFilesGenerationModule {}
