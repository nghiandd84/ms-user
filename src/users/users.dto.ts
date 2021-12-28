import { ApiProperty, PartialType } from '@nestjs/swagger';
export class User {
  @ApiProperty({ required: false, readOnly: true })
  id: number;
  @ApiProperty({ default: 'John' })
  firstName: string;
  @ApiProperty({ default: 'Smith' })
  lastName: string;
  @ApiProperty({ default: 'john.smith@yopmail.com' })
  email: string;
  @ApiProperty({ default: 'Test123!@#' })
  password?: string;
}

export class UpdateUser extends PartialType(User) {}
