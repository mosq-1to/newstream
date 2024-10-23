import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoryGenerationModule } from '../story-generation/story-generation.module';
import { StoriesRepository } from './stories.repository';

@Module({
  imports: [StoryGenerationModule],
  providers: [DatabaseService, StoriesService, StoriesRepository],
  controllers: [StoriesController],
})
export class StoriesModule {}
