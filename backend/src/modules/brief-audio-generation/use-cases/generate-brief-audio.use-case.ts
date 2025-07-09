import { Injectable } from '@nestjs/common';
import { BriefsRepository } from '../../briefs/briefs.repository';
import { BriefAudioGenerationQueue } from '../brief-audio-generation.queue';

@Injectable()
export class GenerateBriefAudioUseCase {
  constructor(
    private readonly briefsRepository: BriefsRepository,
    private readonly briefAudioGenerationQueue: BriefAudioGenerationQueue,
  ) {}

  async execute(briefId: string): Promise<void> {
    // Get the brief
    const brief = await this.briefsRepository.findOne(briefId);
    if (!brief) {
      throw new Error(`Brief with ID ${briefId} not found`);
    }

    // Generate audio using the queue
    await this.briefAudioGenerationQueue.generateBriefAudio(briefId, brief.content);
  }
}
