import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../modules/User/user.interface';
import status from 'http-status';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../config';
import User from '../modules/User/user.model';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';

const auth = (...requireRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if the token is sent from client
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }
    //check if the token is valid

    const decoded = verifyToken(token, config.jwt_access_secret as string);

    // const role = decoded.role;
    const { id, role } = decoded;

    //check if user is exist
    const user = await User.isUserExistByCustomId(id);

    if (!user) {
      throw new AppError(status.NOT_FOUND, '🔍❓ User not Found');
    }

    if (requireRoles && !requireRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
