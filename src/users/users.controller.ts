import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, AccessRole, AccessPermission } from 'dn-api-core';
import { USER_ROLE, USER_PERMISSION } from 'dn-core';

import { UsersService } from './users.service';
import { AssignRole, CreateUser, UpdateUser } from './users.dto';

@ApiTags('users')
@CrudAuth({
  property: 'user',
})
@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      accesses: {
        eager: true,
      },
    },
    exclude: ['password'],
  },

  routes: {
    getOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    getManyBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    createManyBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    createOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    deleteOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    updateOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    replaceOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
    recoverOneBase: {
      decorators: [UseGuards(AccessRole(USER_ROLE.ADMIN))],
    },
  },
  dto: {
    create: CreateUser,
    update: UpdateUser,
    replace: UpdateUser,
  },
})
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('assign_role')
  @UseGuards(AccessRole(USER_ROLE.ADMIN), AccessPermission(USER_PERMISSION.ASSIGN_ROLE))
  assignRole(@Body() assignRole: AssignRole): any {
    return assignRole;
  }
}
