import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { StreamRepository } from './stream.repository';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly streamRepository: StreamRepository,
  ) {}

  public async getStoryPlaylistFile(storyId: string) {
    const { hlsOutputDir, wavFiles } =
      this.streamRepository.getStoryPaths(storyId);

    //todo - initialize audio generation process for the story if not started

    return await this.hlsService.createPlaylistFile(hlsOutputDir, wavFiles);
  }
}
