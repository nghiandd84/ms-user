import { PickType } from '@nestjs/swagger';
import { Permission } from './permission.entity';
export class CreatePermissionDto extends PickType(Permission, [
  'key',
  'name',
  'description'
]) {}

export class UpdatePermissionDto extends PickType(Permission, [
  'name',
  'description'
]) {}
