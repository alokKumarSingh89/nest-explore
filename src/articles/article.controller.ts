import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from '@app/user/decorators/user.decorator';
import { CreateArticleDTO } from './dto/article.dto';
import { UserEntity } from '@app/user/user.entity';
import { AuthGuard } from '@app/user/guard/auth.guard';
import { ArticleResponse } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(readonly articleService: ArticleService) {}

  @Get()
  async allArticle(): Promise<any> {
    return this.articleService.getAllArticle();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(
    @User() currenctUser: UserEntity,
    @Body('article') createArticleDTO: CreateArticleDTO,
  ): Promise<ArticleResponse> {
    const article = await this.articleService.createArticle(
      currenctUser,
      createArticleDTO,
    );
    return this.articleService.buildArticleRespose(article);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponse> {
    const article = await this.articleService.getBySlug(slug);
    return this.articleService.buildArticleRespose(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currenctUserId: number,
    @Param('slug') slug: string,
  ) {
    return this.articleService.deleteArticle(currenctUserId, slug);
  }
}
