import * as bcrypt from 'bcrypt';
export const comparePasswords = (
  userPassword: string,
  currentPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(currentPassword, userPassword);
};
