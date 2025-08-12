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
    const childJobIds: string[] = [];
    const children = [...splitter].map((text, index) => {
      const jobId = uuidv4();
      const jobName = GenerateBriefAudioProcessChunkJob.getName(briefId, index);
      childJobIds.push(jobId);

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

    if (childJobIds.length > 0) {
      const client = await this.queue.client;
      const pipeline = client.multi();
      const key = this.heartbeatKey(briefId);
      const now = Date.now();
      for (const id of childJobIds) {
        pipeline.zadd(key, now, String(id));
      }
      await pipeline.exec();
    }
  }

  private heartbeatKey(briefId: string) {
    return this.queue.toKey(`brief:lastRequestAt:${briefId}`);
  }

  private async updateActiveJobsLastRequestAt(briefId: string) {
    const activeJobs = await this.getActiveGenerateBriefAudioProcessChunkJobs(briefId);
    if (activeJobs.length > 0) {
      const client = await this.queue.client;
      const pipeline = client.multi();
      const key = this.heartbeatKey(briefId);
      const now = Date.now();
      for (const job of activeJobs) {
        pipeline.zadd(key, now, String(job.id));
      }
      await pipeline.exec();
    }
  }

  async getLastRequestAt(briefId: string, jobId: string): Promise<number | null> {
    const client = await this.queue.client;
    const key = this.heartbeatKey(briefId);
    const score = (await client.zscore(key, String(jobId))) as string | null;
    return score === null ? null : Number(score);
  }

  async removeHeartbeat(briefId: string, jobId: string): Promise<void> {
    const client = await this.queue.client;
    const key = this.heartbeatKey(briefId);
    await client.zrem(key, String(jobId));
  }

  async clearHeartbeats(briefId: string): Promise<void> {
    const client = await this.queue.client;
    const key = this.heartbeatKey(briefId);
    await client.del(key);
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
