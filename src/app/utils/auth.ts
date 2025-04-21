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
    // console.log('token in auth guard', token);
    // let decoded;
    // try {
    //   decoded = jwt.verify(
    //     token,
    //     config.jwt_access_secret as string,
    //   ) as JwtPayload;
    //   // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    // } catch (err) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
    // }
    // if (!decoded) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
    // }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { emailOrPhone, role } = decoded;

    // const user = await User.findOne({ _id: decoded.id });
    //check if user is exist
    const user = await User.isUserExistByEmailOrPhone(emailOrPhone);

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

// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utils/catchAsync';
// import { TUserRole } from '../modules/User/user.interface';
// import status from 'http-status';
// import { verifyToken } from '../modules/Auth/auth.utils';
// import config from '../config';
// import User from '../modules/User/user.model';
// import { JwtPayload } from 'jsonwebtoken';
// import AppError from '../errors/AppError';

// const auth = (...requireRoles: TUserRole[]) => {
//   // console.log(requireAuth);
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     //check if the token is sent from client
//     if (!token) {
//       throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
//     }

//     //check if the token is valid

//     // const decoded = jwt.verify(
//     //   token,
//     //   config.jwt_access_secret as string,
//     // ) as JwtPayload;

//     const decoded = verifyToken(token, config.jwt_access_secret as string);
//     console.log(decoded);

//     // const role = decoded.role;
//     const { emailOrPhone, role, iat } = decoded;

//     //check if user is exist
//     const user = await User.isUserExistByEmailOrPhone(emailOrPhone);

//     if (!user) {
//       throw new AppError(status.NOT_FOUND, '🔍❓ User not Found');
//     }

//     if (requireRoles && !requireRoles.includes(role)) {
//       throw new AppError(status.UNAUTHORIZED, 'You are not authorized');
//     }

//     req.user = decoded as JwtPayload;
//     next();
//   });
// };
// export default auth;
