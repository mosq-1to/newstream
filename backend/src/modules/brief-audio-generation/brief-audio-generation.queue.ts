import { InjectFlowProducer, InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowChildJob, FlowJob, FlowProducer, Job, Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { FlowProducerName } from '../../types/flow-producer.enum';
import { QueueName } from '../../types/queue-name.enum';
import {
  GenerateBriefAudioJob,
  GenerateBriefAudioProcessChunkJob,
} from './jobs/generate-brief-audio.job';
import { TextSplitterStream } from '../../ai/kokoro/lib/splitter';
import { GenerateBriefAutioProcessChunkJobPriority } from './jobs/generate-brief-audio.job';
import { Logger } from '@nestjs/common';

@Injectable()
export class BriefAudioGenerationQueue {
  private readonly logger = new Logger(BriefAudioGenerationQueue.name);

  constructor(
    @InjectQueue(QueueName.BriefAudioGeneration)
    private readonly queue: Queue,
    @InjectFlowProducer(FlowProducerName.BriefAudioGeneration)
    private readonly flowProducer: FlowProducer,
  ) {
    // Configure stalledInterval using the queue's internal BullMQ queue object
    // Type assertion is needed to access the underlying BullMQ queue
    try {
      // Access the stalledInterval through the underlying BullMQ queue
      const queueAny = this.queue as any;
      if (queueAny && queueAny.opts) {
        queueAny.opts.stalledInterval = 120 * 1000; // 120 seconds (default is 30s)
        queueAny.opts.maxStalledCount = 3; // Number of times a job can be marked as stalled before failing
        this.logger.log('stalledInterval configured to 120 seconds');
      }
    } catch (err) {
      this.logger.error('Failed to configure stalledInterval:', err);
    }
  }

  async generateBriefAudio(briefId: string, content: string, userId: string) {
    if (await this.isAudioGenerationInProgress(briefId)) {
      console.log(`Audio generation already started for Brief#${briefId}`);
      return;
    }

    const jobName = GenerateBriefAudioJob.getName(briefId);
    const splitter = new TextSplitterStream();
    const mainJobId = uuidv4();
    // Create a job for each chunk
    splitter.push(content);
    const children = [...splitter].map((text, index) => {
      const jobId = uuidv4();
      const jobName = GenerateBriefAudioProcessChunkJob.getName(briefId, index);

      return {
        name: jobName,
        queueName: QueueName.BriefAudioGeneration,
        data: {
          briefId,
          text,
          chunkIndex: index,
          userId,
        },
        opts: {
          jobId,
          // prioritize first chunk
          priority:
            index === 0
              ? GenerateBriefAutioProcessChunkJobPriority.FirstChunk
              : GenerateBriefAutioProcessChunkJobPriority.Normal,
        },
      } as FlowChildJob;
    });

    // Create a parent job that depends on all the chunk jobs
    const tree: FlowJob = {
      name: jobName,
      queueName: QueueName.BriefAudioGeneration,
      data: {
        briefId,
        userId,
      },
      opts: {
        jobId: mainJobId,
      },
      children,
    };

    await this.flowProducer.add(tree);
  }

  async isAudioGenerationInProgress(briefId: string) {
    const jobs = (await this.queue.getJobs(['waiting-children'])) as Job[];

    return jobs.some((job) => job.data.briefId === briefId);
  }
}
