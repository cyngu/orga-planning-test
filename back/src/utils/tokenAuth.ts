import * as jwt from 'jsonwebtoken';

const publicKey = process.env.AUTH_PUBLIC_KEY;

export const createJwtToken = (user) => {
  const userRole = user.UserRoles.map((role) => role.role.roleName);
  const token = jwt.sign(
    {
      userLastName: user.lastName,
      userFirstName: user.firstName,
      userTrigramme: user.trigramme,
      userRole: userRole,
      userEmail: user.email,
      userId: user.id,
    },
    publicKey,
    { expiresIn: '24h' },
  );
  return token;
};

export const decodeToken = (token): TokenAuthType => {
  try {
    const decoded = jwt.verify(token, publicKey) as TokenAuthType;
    return decoded;
  } catch (e) {
    throw new Error('Token not valid');
  }
};

export type TokenAuthType = {
  userLastName: string;
  userFirstName: string;
  userTrigramme: string;
  userRole: string[];
  userEmail: string;
  userId: string;
};
