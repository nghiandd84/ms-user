import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './users.entity';
import { User } from './users.dto';
import { Login } from 'dn-api-core';
import { comparePasswords, toUserDto } from './user.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  showAll() {
    return this.repository.find();
  }

  create(data: User) {
    const userEntity = this.repository.create(data);
    return this.repository
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
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  read(id: number) {
    return this.repository.findOne({ where: { id: id } }).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }

  update(id: number, data: Partial<User>) {
    return this.repository.update({ id }, data).then((result) => {
      if (result.affected === 1) {
        return this.repository
          .findOne({ id })
          .then((userEntity) => Promise.resolve(toUserDto(userEntity)));
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }

  destroy(id: number) {
    return this.repository.delete({ id }).then((data) => {
      if (data.affected === 1) {
        return Promise.resolve(true);
      }
      return Promise.reject(
        new HttpException('Not found', HttpStatus.BAD_REQUEST),
      );
    });
  }

  async findByLogin({ email, password }: Login): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
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
