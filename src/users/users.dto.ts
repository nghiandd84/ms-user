import { ApiProperty, PartialType } from '@nestjs/swagger';
// export class User {
//   @ApiProperty({ required: false, readOnly: true })
//   id: number;
//   @ApiProperty({ default: 'John' })
//   firstName: string;
//   @ApiProperty({ default: 'Smith' })
//   lastName: string;
//   @ApiProperty({ default: 'john.smith@yopmail.com' })
//   email: string;
//   @ApiProperty({ default: 'Test123!@#' })
//   password?: string;
// }

// export class UpdateUser extends PartialType(User) {}

import { PickType } from '@nestjs/swagger';
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

