
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessRole, AccessPermission } from 'dn-api-core';
import { USER_ROLE, USER_PERMISSION } from 'dn-core';

import { RoleService } from './role.service';
import { CreateRole, UpdateRole, ReplaceRole, Role, AssignPermission } from './role.dto';

@ApiTags('roles')
@CrudAuth({
  property: 'user',
})
@Crud({
  model: {
    type: Role,
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
    create: CreateRole,
    update: UpdateRole,
    replace: ReplaceRole,
  },
})
@Controller('roles')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post('assign_permission')
  @UseGuards(AccessRole(USER_ROLE.ADMIN), AccessPermission(USER_PERMISSION.ASSIGN_PERMISSION))
  assignRole(@Body() assignRole: AssignPermission): Promise<boolean> {
    return this.service.assignPermission(assignRole)
  }

  @Post('unassign_permission')
  @UseGuards(AccessRole(USER_ROLE.ADMIN), AccessPermission(USER_PERMISSION.UN_ASSIGN_PERMISSION))
  unassignRole(@Body() assignRole: AssignPermission): Promise<boolean> {
    return this.service.assignPermission(assignRole, true)
  }
}
