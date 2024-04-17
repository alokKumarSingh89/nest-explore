import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDTO } from './dto/createuser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  async index(@Body('user') createUserDTO: CreateUserDTO): Promise<any> {
    return this.userService.createUser(createUserDTO);
  }
}
