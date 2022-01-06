import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { AccessEntity, UserEntity } from './users.entity';
import { AssignRole, User } from './users.dto';
import { comparePasswords } from './user.helper';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo,
    private roleService: RoleService,
  ) {
    super(repo);
  }
  private readonly logger = new Logger(UsersService.name);

  

  // Create User
  create(data: User) {
    this.logger.debug('Create new user');
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
    this.logger.debug('find by email and password');
    const user = await this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['accesses'],
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

  assignRole(
    assignRole: AssignRole,
    isUnAssign: boolean = false,
  ): Promise<boolean> {
    let user: UserEntity;
    return this.repo
      .findOne(assignRole.userId, { relations: ['accesses'] })
      .then((userData) => {
        if (!userData) {
          throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        user = userData;
        const existAccess = user.accesses.find(
          (access) =>
            access.roleKey === assignRole.roleKey &&
            access.locationId === assignRole.locationId,
        );
        if (existAccess && !isUnAssign) {
          this.logger.debug(existAccess);
          throw new HttpException(
            'Role was already assign',
            HttpStatus.BAD_REQUEST,
          );
        }
        return this.roleService.findOne({ where: { key: assignRole.roleKey } });
      })
      .then((role) => {
        if (isUnAssign) {
          const findIndex = user.accesses.findIndex(
            (access) =>
              access.roleKey === assignRole.roleKey &&
              access.locationId === assignRole.locationId,
          );
          if (findIndex >= 0) {
            const access = user.accesses[findIndex];
            access.remove().then();
          }
        } else {
          const access = AccessEntity.create();
          access.locationId = assignRole.locationId;
          access.appId = assignRole.appId;
          access.roleKey = assignRole.roleKey;
          access.role = role;
          user.accesses.push(access);
        }
        return this.repo.save(user);
      })
      .then((_) => Promise.resolve(true));
  }
}
