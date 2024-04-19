import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDTO } from './dto/article.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleResponse } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    readonly articleRepo: Repository<ArticleEntity>,
  ) {}

  async getAllArticle() {
    return this.articleRepo.find();
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
  buildArticleRespose(article: ArticleEntity): ArticleResponse {
    return { article };
  }
}
