import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { BriefWriteDto } from './interface/brief-write.dto';
import { Brief } from '@prisma/client';

@Injectable()
export class BriefsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll(): Promise<Brief[]> {
    return this.databaseService.brief.findMany({
      include: {
        articles: true,
        topic: true,
      },
    });
  }

  async findOne(id: string): Promise<Brief | null> {
    return this.databaseService.brief.findUnique({
      where: { id },
      include: {
        articles: true,
        topic: true,
      },
    });
  }

  async saveBrief(brief: BriefWriteDto): Promise<Brief> {
    return this.databaseService.brief.create({
      data: {
        content: brief.content,
        articles: {
          connect: brief.articleIds.map((id) => ({ id })),
        },
        topic: {
          connect: { id: brief.topicId },
        },
      },
      include: {
        articles: true,
        topic: true,
      },
    });
  }
}
