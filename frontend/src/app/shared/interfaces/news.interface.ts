export interface INews {
  id: string;
  category_id: string;
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  draft: boolean;
  creation_date: string;

  //client only
  filtered?: boolean;
}
