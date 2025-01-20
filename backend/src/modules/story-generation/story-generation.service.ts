import { Injectable } from '@nestjs/common';
import { TextGenerationService } from '../text-generation/text-generation.service';
import { Article } from '@prisma/client';
import { StoryWriteDto } from '../stories/stories.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName } from '../../types/queue-name.enum';
import { StoriesGeneratedJob } from '../stories/jobs/stories-generated.job';
import { Queue } from 'bullmq';
import { GenerateStoryContentPrompt } from './prompts/generate-story-content.prompt';

@Injectable()
export class StoryGenerationService {
  constructor(
    private readonly textGenerationService: TextGenerationService,
    @InjectQueue(QueueName.StoryGeneration)
    private readonly storiesQueue: Queue,
  ) {}

  async generateStoryFromArticle(article: Article): Promise<StoryWriteDto> {
    console.log('Generating story from article:', article.id);
    const prompt = new GenerateStoryContentPrompt(article.content);

    try {
      return {
        title: article.title,
        thumbnailUrl: article.thumbnailUrl,
        content: await this.textGenerationService.generateContent(prompt.input),
        sourceArticleId: article.id,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public emitStoriesGeneratedJob(stories: StoryWriteDto[]) {
    void this.storiesQueue.add(StoriesGeneratedJob.name, stories);
  }
}
