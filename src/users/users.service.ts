import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { UserEntity } from './users.entity';
import { User } from './users.dto';
import { comparePasswords } from './user.helper';

@Injectable()
@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(@InjectRepository(UserEntity) repo) {
    super(repo);
  }
  private readonly logger = new Logger(UsersService.name);


  // Create User
  create(data: User) {
    this.logger.debug('Create new user')
    const userEntity = this.repo.create(data);
    return this.repo
      .save(userEntity)
      .then((entity) => {
        return Promise.resolve({ id: entity.id });
      })
      .catch((err) => {
        if (err.code === 'ER_DUP_ENTRY') {
          return Promise.reject(
            new HttpException('Duplicate email', HttpStatus.BAD_REQUEST),
          );
        } else {
          return Promise.reject(
            new HttpException('Unkown Error', HttpStatus.BAD_REQUEST),
          );
        }
      });
  }

  findByEmail(email: string): Promise<User> {
    return this.repo.findOne({
      where: {
        email,
      },
    });
  }

  
  async findByLogin(email: string, password: string): Promise<User> {
    this.logger.debug('find by email and password')
    const user = await this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['accesses']
    });

    if (!user) {
      throw new HttpException('Not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
