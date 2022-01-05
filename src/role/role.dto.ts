import { ApiProperty, PickType } from '@nestjs/swagger';
import { RoleEntity } from './role.entity';
export class Role extends PickType(RoleEntity, [
  'id',
  'key',
  'description',
  'name',
]) {}
export class CreateRole extends PickType(RoleEntity, [
  'key',
  'name',
  'description',
]) {}

export class UpdateRole extends PickType(RoleEntity, ['name', 'description']) {}

export class ReplaceRole extends PickType(RoleEntity, [
  'name',
  'description',
]) {}

export class AssignPermission {
  @ApiProperty({ default: 'ROLE_KEY' })
  roleKey: string;

  @ApiProperty({ default: 'PERMISSION_KEY' })
  permissionKey: string;
}
