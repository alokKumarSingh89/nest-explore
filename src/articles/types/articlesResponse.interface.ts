import { ArticleEntity } from '@app/articles/article.entity';

export class ArticlesResponse {
  articles: ArticleEntity[];
  articleCount: number;
}
