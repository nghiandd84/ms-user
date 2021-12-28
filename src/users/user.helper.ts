import * as bcrypt from 'bcrypt';
import { User } from './users.dto';
import { UserEntity } from './users.entity';
export const comparePasswords = (
  userPassword: string,
  currentPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(currentPassword, userPassword);
};

export const toUserDto = (data: UserEntity): User => {
  const { id, email, firstName, lastName } = data;

  const userDto: User = {
    id,
    firstName,
    lastName,
    email,
    // password: undefined
  };

  return userDto;
};
