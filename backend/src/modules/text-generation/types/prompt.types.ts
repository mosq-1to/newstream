export const enum Prompt {
  CategorizeArticle = 'categorize-article',
  TransformArticle = 'transform-article',
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
};
