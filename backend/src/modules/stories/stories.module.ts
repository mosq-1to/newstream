import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoriesRepository } from './stories.repository';
import { AudioGenerationModule } from '../audio-generation/audio-generation.module';

@Module({
  imports: [AudioGenerationModule],
  providers: [DatabaseService, StoriesService, StoriesRepository],
  controllers: [StoriesController],
  exports: [StoriesService],
})
export class StoriesModule {}
