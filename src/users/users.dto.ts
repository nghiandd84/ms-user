
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from './users.entity';
export class User extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'email',
  'password',
  'accesses'
]) {}
export class CreateUser extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'email',
  'password',
]) {}

export class UpdateUser extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'email',
  'accesses'
]) {}

export class ReplaceUser extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'email',
  'accesses'
]) {}

export class AssignRole {
  @ApiProperty({ default: 1 })
  userId: number;

  @ApiProperty({ default:  'ROLE_KEY'})
  roleKey: string;
  @ApiProperty({ default: 'locationId', required: false})
  locationId: string;

  @ApiProperty({ default: 'appId', required: false})
  appId: string;

}