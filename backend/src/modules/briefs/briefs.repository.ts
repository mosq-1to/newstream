import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../utils/database/database.service';
import { BriefWriteDto } from './interface/brief-write.dto';

// Using type definition until Prisma client is regenerated
type Brief = {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  articles?: any[];
};

@Injectable()
export class BriefsRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll(): Promise<Brief[]> {
    return this.databaseService.brief.findMany({
      include: {
        articles: true,
      },
    });
  }

  async findOne(id: string): Promise<Brief | null> {
    return this.databaseService.brief.findUnique({
      where: { id },
      include: {
        articles: true,
      },
    });
  }

  async saveBrief(brief: BriefWriteDto): Promise<Brief> {
    return this.databaseService.brief.create({
      data: {
        title: brief.title,
        content: brief.content,
        articles: {
          connect: brief.articleIds.map((id) => ({ id })),
        },
      },
      include: {
        articles: true,
      },
    });
  }
}
