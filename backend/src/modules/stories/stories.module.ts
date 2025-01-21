import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';
import { StoriesRepository } from './stories.repository';

@Module({
  imports: [],
  providers: [DatabaseService, StoriesService, StoriesRepository],
  controllers: [StoriesController],
  exports: [StoriesService],
})
export class StoriesModule {}
