import { ArticlesService } from '../articles.service';
import { ArticlesApi } from '../api/articles.api';
import { DatabaseService } from '../../../utils/database/database.service';
import {
  ArticleReadModel,
  ArticleSource,
} from '../api/read-models/article.read-model';
import { Test, TestingModule } from '@nestjs/testing';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articlesApi: ArticlesApi;
  let databaseService: DatabaseService;

  const mockArticles: ArticleReadModel[] = [
    {
      sourceId: '1',
      source: ArticleSource.WorldNewsApi,
      title: 'title',
      url: 'url',
      content: 'content',
      thumbnailUrl: 'thumbnailUrl',
    },
    {
      sourceId: '2',
      source: ArticleSource.Newsdata,
      title: 'title',
      url: 'url',
      content: 'content',
      thumbnailUrl: 'thumbnailUrl',
    },
    {
      sourceId: '3',
      source: ArticleSource.WorldNewsApi,
      title: 'title',
      url: 'url',
      content: 'content',
      thumbnailUrl: 'thumbnailUrl',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: ArticlesApi,
          useValue: {
            getArticles: jest.fn().mockResolvedValue(mockArticles),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            article: {
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    articlesApi = module.get<ArticlesApi>(ArticlesApi);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLatestArticles', () => {
    it('should return the latest articles', async () => {
      const result = await service.getLatestArticles();
      expect(articlesApi.getArticles).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });
  });

  describe('saveArticlesToDatabase', () => {
    it('should save articles to the database', async () => {
      await service.saveArticlesToDatabase(mockArticles);
      expect(databaseService.article.createMany).toHaveBeenCalledWith({
        data: mockArticles,
        skipDuplicates: true,
      });
    });
  });
});
