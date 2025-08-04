import { Test, TestingModule } from '@nestjs/testing';
import { BriefAudioGenerationJobProcessor } from '../brief-audio-generation.job-processor';
import { BriefAudioStorageRepository } from '../../storage/brief-audio-storage.repository';
import { AudioGenerationService } from '../../audio-generation/audio-generation.service';
import { HlsService } from '../../../utils/audio/hls.service';
import {
  GenerateBriefAudioJob,
  GenerateBriefAudioProcessChunkJob,
} from '../jobs/generate-brief-audio.job';
import { Job } from 'bullmq';
import path from 'path';

describe('BriefAudioGenerationJobProcessor', () => {
  let processor: BriefAudioGenerationJobProcessor;
  let briefAudioStorageRepository: BriefAudioStorageRepository;
  let audioGenerationService: AudioGenerationService;
  let hlsService: HlsService;

  const mockBriefAudioStorageRepository = {
    getBriefPaths: jest.fn(),
  };

  const mockAudioGenerationService = {
    generateSpeechFromText: jest.fn(),
  };

  const mockHlsService = {
    appendPlaylistFile: jest.fn(),
    closePlaylistFile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BriefAudioGenerationJobProcessor,
        {
          provide: BriefAudioStorageRepository,
          useValue: mockBriefAudioStorageRepository,
        },
        {
          provide: AudioGenerationService,
          useValue: mockAudioGenerationService,
        },
        {
          provide: HlsService,
          useValue: mockHlsService,
        },
      ],
    }).compile();

    processor = module.get<BriefAudioGenerationJobProcessor>(BriefAudioGenerationJobProcessor);
    briefAudioStorageRepository = module.get<BriefAudioStorageRepository>(
      BriefAudioStorageRepository,
    );
    audioGenerationService = module.get<AudioGenerationService>(AudioGenerationService);
    hlsService = module.get<HlsService>(HlsService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should throw error for unknown job name', async () => {
      const unknownJob = {
        name: 'unknown-job',
        data: {},
      } as unknown as Job;

      await expect(processor.process(unknownJob as GenerateBriefAudioJob)).rejects.toThrow(
        'BriefAudioGenerationJobProcessor.process(): Unknown job name',
      );
    });

    it('should close playlist file for parent job', async () => {
      const briefId = 'brief-1';
      const parentJob = {
        name: `generate-brief-audio-${briefId}`,
        data: {
          briefId,
          userId: 'user-1',
        },
      } as unknown as GenerateBriefAudioJob;

      const mockPaths = {
        wavOutputDir: '/path/to/wav',
        hlsOutputDir: '/path/to/hls',
      };

      mockBriefAudioStorageRepository.getBriefPaths.mockReturnValue(mockPaths);

      await processor.process(parentJob);

      expect(briefAudioStorageRepository.getBriefPaths).toHaveBeenCalledWith(briefId);
      expect(hlsService.closePlaylistFile).toHaveBeenCalledWith(mockPaths.hlsOutputDir);
    });

    describe('process chunk job', () => {
      it('should process chunk job when user is current in round robin', async () => {
        const briefId = 'brief-1';
        const userId = 'user-1';
        const text = 'Test text';
        const chunkIndex = 0;

        const chunkJob = {
          name: GenerateBriefAudioProcessChunkJob.getName(briefId, chunkIndex),
          data: {
            briefId,
            userId,
            text,
            chunkIndex,
          },
          moveToDelayed: jest.fn(),
        } as unknown as GenerateBriefAudioProcessChunkJob;

        const mockPaths = {
          wavOutputDir: '/path/to/wav',
          hlsOutputDir: '/path/to/hls',
        };

        mockBriefAudioStorageRepository.getBriefPaths.mockReturnValue(mockPaths);

        await processor.process(chunkJob);

        const wavFilePath = path.join(mockPaths.wavOutputDir, `audio-${chunkIndex}.wav`);

        expect(briefAudioStorageRepository.getBriefPaths).toHaveBeenCalledWith(briefId);
        expect(audioGenerationService.generateSpeechFromText).toHaveBeenCalledWith(
          text,
          wavFilePath,
        );
        expect(hlsService.appendPlaylistFile).toHaveBeenCalledWith(
          mockPaths.hlsOutputDir,
          wavFilePath,
          chunkIndex,
        );
        expect(chunkJob.moveToDelayed).not.toHaveBeenCalled();
      });

      it('should move job to delayed queue when user is not current in round robin', async () => {
        const briefId1 = 'brief-1';
        const userId1 = 'user-1';
        const text1 = 'Test text 1';
        const chunkIndex1 = 0;

        const chunkJob1 = {
          name: GenerateBriefAudioProcessChunkJob.getName(briefId1, chunkIndex1),
          data: {
            briefId: briefId1,
            userId: userId1,
            text: text1,
            chunkIndex: chunkIndex1,
          },
          moveToDelayed: jest.fn(),
        } as unknown as GenerateBriefAudioProcessChunkJob;

        // First job gets processed
        await processor.process(chunkJob1);

        // Second job with different user should be delayed
        const briefId2 = 'brief-2';
        const userId2 = 'user-2';
        const text2 = 'Test text 2';
        const chunkIndex2 = 0;

        const chunkJob2 = {
          name: GenerateBriefAudioProcessChunkJob.getName(briefId2, chunkIndex2),
          data: {
            briefId: briefId2,
            userId: userId2,
            text: text2,
            chunkIndex: chunkIndex2,
          },
          moveToDelayed: jest.fn(),
        } as unknown as GenerateBriefAudioProcessChunkJob;

        jest.spyOn(Date, 'now').mockImplementation(() => 1000);

        await processor.process(chunkJob2);

        expect(chunkJob2.moveToDelayed).toHaveBeenCalledWith(1100);
      });

      it('should handle errors during chunk processing', async () => {
        const briefId = 'brief-1';
        const userId = 'user-1';
        const text = 'Test text';
        const chunkIndex = 0;

        const chunkJob = {
          name: GenerateBriefAudioProcessChunkJob.getName(briefId, chunkIndex),
          data: {
            briefId,
            userId,
            text,
            chunkIndex,
          },
          moveToDelayed: jest.fn(),
        } as unknown as GenerateBriefAudioProcessChunkJob;

        const mockPaths = {
          wavOutputDir: '/path/to/wav',
          hlsOutputDir: '/path/to/hls',
        };

        mockBriefAudioStorageRepository.getBriefPaths.mockReturnValue(mockPaths);
        const error = new Error('Generation failed');
        mockAudioGenerationService.generateSpeechFromText.mockRejectedValue(error);

        await expect(processor.process(chunkJob)).rejects.toThrow(error);

        const wavFilePath = path.join(mockPaths.wavOutputDir, `audio-${chunkIndex}.wav`);
        expect(audioGenerationService.generateSpeechFromText).toHaveBeenCalledWith(
          text,
          wavFilePath,
        );
        expect(hlsService.appendPlaylistFile).not.toHaveBeenCalled();
      });
    });
  });

  describe('round robin behavior', () => {
    it('should process jobs in round-robin fashion across users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const createJob = (userId: string, index: number) =>
        ({
          name: GenerateBriefAudioProcessChunkJob.getName(`brief-${userId}`, index),
          data: {
            briefId: `brief-${userId}`,
            userId,
            text: `Text for ${userId}`,
            chunkIndex: index,
          },
          moveToDelayed: jest.fn(),
        }) as unknown as GenerateBriefAudioProcessChunkJob;

      mockBriefAudioStorageRepository.getBriefPaths.mockReturnValue({
        wavOutputDir: '/path/to/wav',
        hlsOutputDir: '/path/to/hls',
      });

      // First round - all jobs should be processed
      for (const userId of userIds) {
        const job = createJob(userId, 0);
        await processor.process(job);
        expect(job.moveToDelayed).not.toHaveBeenCalled();
        expect(audioGenerationService.generateSpeechFromText).toHaveBeenCalled();
      }

      // Reset mocks for second round
      jest.clearAllMocks();

      // Second round - first user should be processed again
      const firstUserJob = createJob(userIds[0], 1);
      await processor.process(firstUserJob);
      expect(firstUserJob.moveToDelayed).not.toHaveBeenCalled();
      expect(audioGenerationService.generateSpeechFromText).toHaveBeenCalled();

      // But trying to process user-2 before completing the round should delay it
      const secondUserJob = createJob(userIds[1], 1);
      await processor.process(secondUserJob);
      expect(secondUserJob.moveToDelayed).toHaveBeenCalled();
    });
  });
});
