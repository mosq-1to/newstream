import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { DatabaseService } from '../../utils/database/database.service';

@Module({
  providers: [DatabaseService, StoriesService],
  controllers: [StoriesController],
})
export class StoriesModule {}
