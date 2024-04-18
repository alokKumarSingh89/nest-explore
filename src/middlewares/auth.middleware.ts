import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { ExpressRequestInterface } from '@app/user/interface/request.interface';
import { verify } from 'jsonwebtoken';
import { JSON_WEB_TOKEN } from '@app/config';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(readonly userService: UserService) {}
  async use(
    req: ExpressRequestInterface,
    res: Response,
    next: (error?: any) => void,
  ) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JSON_WEB_TOKEN);
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      req.user = null;
      next();
    }
  }
}
