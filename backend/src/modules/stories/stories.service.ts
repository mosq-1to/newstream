import { Injectable } from '@nestjs/common';
import { StoriesRepository } from './stories.repository';
import { StoryWriteDto } from './interface/story-write.dto';
import { AudioGenerationService } from '../audio-generation/audio-generation.service';

@Injectable()
export class StoriesService {
  constructor(
    private readonly storiesRepository: StoriesRepository,
    private readonly audioGenerationService: AudioGenerationService,
  ) {}

  async getAllStories() {
    return this.storiesRepository.getAllStories();
  }

  async getStoryById(id: string) {
    return this.storiesRepository.getStoryById(id);
  }

  async saveStories(stories: StoryWriteDto[]) {
    return this.storiesRepository.saveStories(stories);
  }

  async getPlaylistPathByStoryId(id: string) {
    const story = await this.getStoryById(id);
    return this.audioGenerationService.generateSpeechHls(
      story.content,
      story.id,
    );
  }

  async getSegmentFilePathByStoryIdAndSegmentId(
    storyId: string,
    segmentId: string,
  ) {
    return this.audioGenerationService.getSegmentFilePath(storyId, segmentId);
  }
}
