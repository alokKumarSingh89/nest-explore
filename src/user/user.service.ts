import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/createuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './dto/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDTO: CreateUserDTO): Promise<any> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);
    console.log(newUser);
    return this.userRepository.save(newUser);
  }
}
