import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDTO } from './dto/article.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleResponse } from './types/articleResponse.interface';
import { ArticlesResponse } from './types/articlesResponse.interface';
import { QueryInterface } from './types/query.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    readonly articleRepo: Repository<ArticleEntity>,
    readonly dataSource: DataSource,
  ) {}

  async getAllArticle(
    currenctUserId: number,
    query: QueryInterface,
  ): Promise<ArticlesResponse> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');
    queryBuilder.orderBy('article.createAt', 'DESC');

    if (query.tag) {
      queryBuilder.andWhere('article.tageList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }
    const articleCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articleCount };
  }
  async createArticle(
    currenctUser: UserEntity,
    createArticleDTO: CreateArticleDTO,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDTO);
    if (!article.tageList) {
      article.tageList = [];
    }
    article.author = currenctUser;
    return this.articleRepo.save(article);
  }
  async getBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepo.findOne({ where: { slug } });
  }

  async deleteArticle(
    currenctUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.getBySlug(slug);
    if (!article) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currenctUserId) {
      throw new HttpException("Don't have access", HttpStatus.FORBIDDEN);
    }
    return this.articleRepo.delete({ slug });
  }
  async updateArticle(
    currenctUserId: number,
    slug: string,
    updateArticleDTO: CreateArticleDTO,
  ): Promise<ArticleEntity> {
    const article = await this.getBySlug(slug);
    if (!article) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currenctUserId) {
      throw new HttpException("Don't have access", HttpStatus.FORBIDDEN);
    }
    Object.assign(article, updateArticleDTO);
    return this.articleRepo.save(article);
  }
  buildArticleRespose(article: ArticleEntity): ArticleResponse {
    return { article };
  }
}
