import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TopicsRepository } from './topics.repository';
import { DatabaseService } from '../../utils/database/database.service';

@Module({
  imports: [],
  controllers: [TopicsController],
  providers: [TopicsService, TopicsRepository, DatabaseService],
  exports: [TopicsService, TopicsRepository],
})
export class TopicsModule { }
