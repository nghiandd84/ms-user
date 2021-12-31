import { Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';
import { User, Access, AccessGuard } from 'dn-api-core';

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
      decorators: [UseGuards(AccessGuard('PERMISSION_GET_ONE', 'USER'))],
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
