import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/createuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JSON_WEB_TOKEN } from '@app/config';

@Injectable()
export class UserService {
  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JSON_WEB_TOKEN,
    );
  }
  constructor(
    @InjectRepository(UserEntity)
    readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const isUseExits = await this.userRepository.find({
      where: [
        { email: createUserDTO.email },
        { username: createUserDTO.username },
      ],
    });
    console.log(isUseExits);
    if (isUseExits.length > 0) {
      throw new HttpException(
        'Either Username or Email exits',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);
    console.log(newUser);
    return this.userRepository.save(newUser);
  }

  async login(userDto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });
    if (!user) {
      throw new HttpException(
        'Credatial is wrorng',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credatial is wrorng',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;
    return user;
  }
  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }
}
