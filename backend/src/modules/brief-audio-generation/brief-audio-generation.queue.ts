import { InjectFlowProducer, InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { FlowProducer, Job, Queue } from "bullmq";
import { v4 as uuidv4 } from "uuid";
import { FlowProducerName } from "../../types/flow-producer.enum";
import { QueueName } from "../../types/queue-name.enum";
import {
  GenerateBriefAudioJob,
  GenerateBriefAudioProcessChunkJob,
} from "./jobs/generate-brief-audio.job";
import { TextSplitterStream } from "../../ai/kokoro/lib/splitter";

@Injectable()
export class BriefAudioGenerationQueue {
  constructor(
    @InjectQueue(QueueName.BriefAudioGeneration)
    private readonly queue: Queue,
    @InjectFlowProducer(FlowProducerName.BriefAudioGeneration)
    private readonly flowProducer: FlowProducer,
  ) {}

  async generateBriefAudio(briefId: string, content: string) {
    const jobName = GenerateBriefAudioJob.getName(briefId);
    const mainJobId = uuidv4();
    const splitter = new TextSplitterStream();

    if (await this.checkIfGenerateBriefAudioJobExists(briefId)) {
      console.log(`Audio generation already started for Brief#${briefId}`);
      return;
    }

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
        },
        opts: {
          jobId,
        },
      };
    });

    // Create a parent job that depends on all the chunk jobs
    const tree = {
      name: jobName,
      queueName: QueueName.BriefAudioGeneration,
      data: {
        briefId,
      },
      opts: {
        jobId: mainJobId,
      },
      children,
    };

    await this.flowProducer.add(tree);
  }

  async checkIfGenerateBriefAudioJobExists(briefId: string) {
    //todo - think about less resource intensive way
    const jobs = (await this.queue.getJobs()) as Job[];

    return jobs.some(
      (job) => job.name === GenerateBriefAudioJob.getName(briefId),
    );
  }
}
