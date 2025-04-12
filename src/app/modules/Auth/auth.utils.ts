import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { emailOrPhone: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  const jwtOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(jwtPayload, secret, jwtOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
