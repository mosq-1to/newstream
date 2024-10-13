export interface ExtractorArticleData {
  url: string;
  title: string;
  description: string;
  image: string;
  author: string;
  favicon: string;
  content: string;
  published: string; // DateString
  type: string; // page type
  source: string; // original publisher
  links: string[]; // list of alternative links
  ttr: number; // time to read in second, 0 = unknown
}
