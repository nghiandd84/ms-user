import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, AccessRole } from 'dn-api-core';
import { USER_ROLE } from 'dn-core';

import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';

@ApiTags('permissions')
@CrudAuth({
  property: 'user',
  filter: (user: User) => {
    console.log(user);
    return {
      id: user.id,
    };
  },
  persist: (user: User) => ({
    email: user.email,
  }),
})
@Crud({
  model: {
    type: Permission,
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
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  dto: {
    create: CreatePermissionDto,
    update: UpdatePermissionDto,
    replace: UpdatePermissionDto,
  },
})
@Controller('permissions')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly service: PermissionService) {}
}
