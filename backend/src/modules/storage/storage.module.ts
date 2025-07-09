import { Module } from '@nestjs/common';
import { StoryAudioStorageRepository } from './story-audio-storage.repository';

@Module({
  providers: [StoryAudioStorageRepository],
  exports: [StoryAudioStorageRepository],
})
export class StorageModule {}
