export const enum Prompt {
  CategorizeArticle = 'categorize-article',
}

export type PromptVariables = {
  [Prompt.CategorizeArticle]: {
    topicsContent: string;
    articleTitle: string;
    articleContent: string;
  };
};
