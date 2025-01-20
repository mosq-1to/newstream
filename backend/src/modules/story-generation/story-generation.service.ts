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

    let storyContent = '';
    try {
      storyContent = await this.textGenerationService.generateContent(
        prompt.input,
      );
    } catch (e) {
      console.error('Failed to generate story content:', e);
    }

    console.log('Generated story content:', storyContent.slice(0, 100));

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
