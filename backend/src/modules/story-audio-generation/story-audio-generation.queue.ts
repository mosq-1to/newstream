import { Injectable } from '@nestjs/common';
import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { FlowProducer, Job, Queue } from 'bullmq';
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
    @InjectQueue(QueueName.StoryAudioGeneration)
    private readonly storyAudioGenerationQueue: Queue,
  ) {}

  async addGenerateStoryAudioJob(storyId: string) {
    // todo - move out as a reusable text splitter util
    const splitter = new TextSplitterStream();
    const story = await this.storiesService.getStoryById(storyId);

    if (await this.checkIfGenerateStoryAudioJobExists(storyId)) {
      console.log(`Audio generation already started for Story#${storyId}`);
      return;
    }

    splitter.push(story.content);
    const textChunks = [...splitter];

    return await this.storyAudioGenerationFlowProducer.add({
      name: GenerateStoryAudioJob.getName(storyId),
      queueName: QueueName.StoryAudioGeneration,
      data: {
        storyId,
      },
      children: [
        ...textChunks.map((text, index) => ({
          name: GenerateStoryAudioProcessChunkJob.getName(storyId, index),
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

  async checkIfGenerateStoryAudioJobExists(storyId: string) {
    //todo - think about less resource intensive way
    const jobs = (await this.storyAudioGenerationQueue.getJobs()) as Job[];

    return jobs.some(
      (job) => job.name === GenerateStoryAudioJob.getName(storyId),
    );
  }
}
