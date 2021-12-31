import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { UserEntity } from './users.entity';
import { User } from './users.dto';
import { Login } from 'dn-api-core';
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

  /*
  read(id: number) {
    return this.repo.findOne({ where: { id: id } }).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }

  update(id: number, data: Partial<User>) {
    return this.repo.update({ id }, data).then((result) => {
      if (result.affected === 1) {
        return this.repo
          .findOne({ id })
          .then((userEntity) => Promise.resolve(toUserDto(userEntity)));
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }

  destroy(id: number) {
    return this.repo.delete({ id }).then((data) => {
      if (data.affected === 1) {
        return Promise.resolve(true);
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }
  */

  async findByLogin(email: string, password: string): Promise<User> {
    this.logger.debug('find by email')
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
