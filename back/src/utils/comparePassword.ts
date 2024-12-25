import * as bcrypt from 'bcryptjs';

export const comparePassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordHashed);
};
