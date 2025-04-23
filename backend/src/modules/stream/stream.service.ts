import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { StreamRepository } from './stream.repository';
import { StoryAudioGenerationQueue } from '../story-audio-generation/story-audio-generation.queue';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly streamRepository: StreamRepository,
    private readonly storyAudioGenerationQueue: StoryAudioGenerationQueue,
  ) {}

  public async getStoryPlaylistFile(storyId: string) {
    const { hlsOutputDir, wavFiles } =
      this.streamRepository.getStoryPaths(storyId);

    // todo - idea - perhaps I could return the playlist.m3u8 file and rewrite it only once new segments are added

    await this.storyAudioGenerationQueue.addGenerateStoryAudioJob(storyId);

    return await this.hlsService.createPlaylistFile(hlsOutputDir, wavFiles);
  }
}
