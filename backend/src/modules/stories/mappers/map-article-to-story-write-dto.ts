import { Article } from '@prisma/client';
import { StoryWriteDto } from '../stories.repository';

export const mapArticleToStoryWriteDto = (article: Article): StoryWriteDto => {
  return {
    title: article.title,
    thumbnailUrl: article.thumbnailUrl,
    content: '',
    sourceArticleId: article.id,
  };
};
