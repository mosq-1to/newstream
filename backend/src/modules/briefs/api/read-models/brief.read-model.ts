export class BriefReadModel {
  id?: string;
  title: string;
  content: string;
  articleIds: string[]; // IDs of related articles
}
