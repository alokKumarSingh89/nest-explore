import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDTO } from '@app/user/dto/createuser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { ExpressRequestInterface } from './interface/request.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async signup(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO);

    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  async getCurrentUser(
    @Req() req: ExpressRequestInterface,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(req.user);
  }
}
