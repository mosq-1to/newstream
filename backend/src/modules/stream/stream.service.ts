import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { StoryAudioGenerationQueue } from '../story-audio-generation/story-audio-generation.queue';
import { StoryAudioStorageRepository } from '../storage/story-audio-storage.repository';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly storyAudioGenerationQueue: StoryAudioGenerationQueue,
    private readonly storyAudioStorageRepository: StoryAudioStorageRepository,
  ) {}

  public async getStoryPlaylistFile(storyId: string) {
    const { hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(storyId);

    await this.storyAudioGenerationQueue.addGenerateStoryAudioJob(storyId);
    return await this.hlsService.getPlaylistFile(hlsOutputDir);
  }

  public async getStorySegmentFile(storyId: string, filename: string) {
    const { hlsOutputDir } = this.storyAudioStorageRepository.getStoryPaths(storyId);
    return `${hlsOutputDir}/${filename}`;
  }
}
