import { Injectable } from '@nestjs/common';
import { HlsService } from '../../utils/audio/hls.service';
import { BriefAudioStorageRepository } from '../storage/brief-audio-storage.repository';
import { GenerateBriefAudioUseCase } from '../brief-audio-generation/use-cases/generate-brief-audio.use-case';

@Injectable()
export class StreamService {
  constructor(
    private readonly hlsService: HlsService,
    private readonly briefAudioStorageRepository: BriefAudioStorageRepository,
    private readonly generateBriefAudioUseCase: GenerateBriefAudioUseCase,
  ) { }


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
