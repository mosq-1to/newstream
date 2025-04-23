import { Injectable } from '@nestjs/common';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FlowProducer } from 'bullmq';
import {
  GenerateStoryAudioJob,
  GenerateStoryAudioProcessChunkJob,
} from './jobs/generate-story-audio.job';
import { FlowProducerName } from '../../types/flow-producer.enum';
import { QueueName } from '../../types/queue-name.enum';
import { TextSplitterStream } from '../../ai/kokoro/lib/splitter';
import { StoriesService } from '../stories/stories.service';

@Injectable()
export class StoryAudioGenerationQueue {
  constructor(
    @InjectFlowProducer(FlowProducerName.StoryAudioGeneration)
    private readonly storyAudioGenerationFlowProducer: FlowProducer,
    private readonly storiesService: StoriesService,
  ) {}

  async addGenerateStoryAudioJob(storyId: string) {
    // todo - move out as a reusable text splitter util
    const splitter = new TextSplitterStream();
    const story = await this.storiesService.getStoryById(storyId);
    splitter.push(story.content);
    const textChunks = [...splitter];

    return await this.storyAudioGenerationFlowProducer.add({
      name: GenerateStoryAudioJob.name,
      queueName: QueueName.StoryAudioGeneration,
      data: {
        storyId,
      },
      children: [
        ...textChunks.map((text, index) => ({
          name: GenerateStoryAudioProcessChunkJob.name,
          queueName: QueueName.StoryAudioGeneration,
          data: {
            storyId,
            text,
            chunkIndex: index,
          },
        })),
      ],
    });
  }
}
