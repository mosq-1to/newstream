import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { StoryAudioGenerationQueue } from '../story-audio-generation/story-audio-generation.queue';
import { StoryAudioStorageRepository } from '../storage/story-audio-storage.repository';
import { BriefAudioStorageRepository } from '../storage/brief-audio-storage.repository';
import { BriefAudioGenerationQueue } from '../brief-audio-generation/brief-audio-generation.queue';
import { GenerateBriefAudioUseCase } from '../brief-audio-generation/use-cases/generate-brief-audio.use-case';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly storyAudioGenerationQueue: StoryAudioGenerationQueue,
    private readonly storyAudioStorageRepository: StoryAudioStorageRepository,
    private readonly briefAudioStorageRepository: BriefAudioStorageRepository,
    private readonly generateBriefAudioUseCase: GenerateBriefAudioUseCase,
  ) { }

  public async getStoryPlaylistFile(storyId: string) {
    const { hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(storyId);

    await this.storyAudioGenerationQueue.addGenerateStoryAudioJob(storyId);
    return await this.hlsService.getPlaylistFile(hlsOutputDir);
  }

  public async getStorySegmentFile(storyId: string, filename: string) {
    const { hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(storyId);
    return `${hlsOutputDir}/${filename}`;
  }

  public async getBriefPlaylistFile(briefId: string) {
    const { hlsOutputDir } = this.briefAudioStorageRepository.getBriefPaths(briefId);

    await this.generateBriefAudioUseCase.execute(briefId);
    return await this.hlsService.getPlaylistFile(hlsOutputDir);
  }

  public async getBriefSegmentFile(briefId: string, filename: string) {
    const { hlsOutputDir } = this.briefAudioStorageRepository.getBriefPaths(briefId);
    return `${hlsOutputDir}/${filename}`;
  }
}
