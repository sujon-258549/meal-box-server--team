import status from 'http-status';
import { TUser } from '../User/user.interface';
import User from '../User/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import AppError from '../../errors/AppError';

const loginUserIntoDB = async (loginInfo: TLoginUser) => {
  const { emailOrPhone, password } = loginInfo;
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  }).select('+password');
  console.log(user);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found!');
  }
  // //check password matched
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(
      status.UNAUTHORIZED,
      'Invalid password. Please try again.',
    );
  }

  //create token and sent to the client
  const usedEmail = user.email === emailOrPhone;
  const jwtPayload = {
    emailOrPhone: usedEmail ? user.email : user.phoneNumber,
    role: user.role,
    id: user?._id,
  };
  // console.log('jwtPayload', jwtPayload);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  //check the given token is verified
  // const decoded = jwt.verify(
  //   token,
  //   config.jwt_refresh_secret as string,
  // ) as JwtPayload;

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { emailOrPhone, iat } = decoded;
  console.log('decoded', decoded);

  //check if user is exist
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, '🔍❓ User not Found');
  }

  //check if user is deleted
  // const isDeleted = user?.isDeleted;
  // if (isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, '🗑️ User is Deleted');
  // }

  // // //check if user is blocked
  // const userStatus = user?.status;
  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, '🚫 User is Blocked');
  // }

  // //check password matched

  // if (
  //   user.passwordChangedAt &&
  //   User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
  // ) {
  //   throw new AppError(
  //     status.UNAUTHORIZED,
  //     'Invalid password. Please try again.',
  //   );
  // }

  //create token and sent to the client
  const usedEmail = user.email === emailOrPhone;
  const jwtPayload = {
    emailOrPhone: usedEmail ? user.email : user.phoneNumber,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUserIntoDB,
  refreshToken,
};
