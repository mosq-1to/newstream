import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoryGenerationModule } from '../story-generation/story-generation.module';

@Module({
  imports: [StoryGenerationModule],
  providers: [DatabaseService, StoriesService],
  controllers: [StoriesController],
})
export class StoriesModule {}
