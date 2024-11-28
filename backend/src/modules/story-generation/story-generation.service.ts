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
    @InjectQueue(QueueName.Stories) private readonly storiesQueue: Queue,
  ) {}

  async generateStoryFromArticle(article: Article): Promise<StoryWriteDto> {
    const prompt = new GenerateStoryContentPrompt(article.content);

    const storyContent = await this.textGenerationService.generateContent(
      prompt.input,
    );

    return {
      title: article.title,
      thumbnailUrl: article.thumbnailUrl,
      content: storyContent,
      sourceArticleId: article.id,
    };
  }

  public emitStoriesGeneratedJob(stories: StoryWriteDto[]) {
    void this.storiesQueue.add(StoriesGeneratedJob.name, stories);
  }
}
