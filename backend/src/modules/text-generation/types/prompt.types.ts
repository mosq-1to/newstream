export const enum Prompt {
  CategorizeArticle = 'categorize-article',
  TransformArticle = 'transform-article',
  GenerateBrief = 'generate-brief',
}

export type PromptVariables = {
  [Prompt.CategorizeArticle]: {
    topicsContent: string;
    articleTitle: string;
    articleContent: string;
  };

  [Prompt.TransformArticle]: {
    articleTitle: string;
    articleContent: string;
  };

  [Prompt.GenerateBrief]: {
    articlesContent: string;
    topicTitle: string;
  };
};
