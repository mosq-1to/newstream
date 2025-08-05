import { Injectable } from '@nestjs/common';
import { BriefsRepository } from '../../briefs/briefs.repository';
import { BriefAudioGenerationQueue } from '../brief-audio-generation.queue';

@Injectable()
export class GenerateBriefAudioUseCase {
  constructor(
    private readonly briefsRepository: BriefsRepository,
    private readonly briefAudioGenerationQueue: BriefAudioGenerationQueue,
  ) {}

  async execute(briefId: string, userId: string): Promise<void> {
    const brief = await this.briefsRepository.findOne(briefId);
    if (!brief) {
      throw new Error(`Brief with ID ${briefId} not found`);
    }

    await this.briefAudioGenerationQueue.generateBriefAudio(briefId, brief.content, userId);
  }
}
