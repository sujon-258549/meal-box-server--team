import { NextFunction, Request, Response } from 'express';

import catchAsync from './catchAsync';
// test cod
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import httpStatus from 'http-status';
import { TUserRole } from '../modules/User/user.interface';
import config from '../config';
import AppError from '../errors/AppError';
import User from '../modules/User/user.model';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { id, role } = decoded;

    //check if user is exist
    const user = await User.isUserExistByCustomId(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Your User Id is Invalid!');
    }

    if (requiredRole && !requiredRole?.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'User does not have the required permissions',
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;

