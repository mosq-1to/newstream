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

@Injectable()
export class BriefAudioGenerationQueue {
  constructor(
    @InjectQueue(QueueName.BriefAudioGeneration)
    private readonly queue: Queue,
    @InjectFlowProducer(FlowProducerName.BriefAudioGeneration)
    private readonly flowProducer: FlowProducer,
  ) {}

  async generateBriefAudio(briefId: string, content: string, userId: string) {
    if (await this.getGenerateBriefAudioJob(briefId)) {
      console.log(`Audio generation already started for Brief#${briefId}`);

      await this.updateActiveJobsLastRequestAt(briefId);
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
          lastRequestAt: Date.now(),
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

  private async updateActiveJobsLastRequestAt(briefId: string) {
    const activeJobs = await this.getActiveGenerateBriefAudioProcessChunkJobs(briefId);
    if (activeJobs.length > 0) {
      activeJobs.forEach(async (job) => {
        await job.updateData({
          ...job.data,
          lastRequestAt: Date.now(),
        });
      });
    }
  }

  async getGenerateBriefAudioJob(briefId: string) {
    const jobs = (await this.queue.getJobs()) as Job[];

    return jobs.find((job) => job.name === GenerateBriefAudioJob.getName(briefId));
  }

  async getActiveGenerateBriefAudioProcessChunkJobs(briefId: string) {
    const jobs = (await this.queue.getJobs([
      'active',
      'delayed',
      'paused',
      'paused',
      'delayed',
    ])) as Job[];

    return jobs.filter((job) =>
      job.name.startsWith(GenerateBriefAudioProcessChunkJob.getNameWithoutChunkIndex(briefId)),
    );
  }

  async checkIfUserHasActiveJobs(userId: string) {
    const jobs = (await this.queue.getJobs([
      'active',
      'delayed',
      'paused',
      'paused',
      'delayed',
    ])) as Job[];

    return jobs.some((job) => job.data.userId === userId);
  }
}
