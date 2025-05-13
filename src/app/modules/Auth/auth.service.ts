import status from 'http-status';
import User from '../User/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import AppError from '../../errors/AppError';

import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';

const loginUserIntoDB = async (loginInfo: TLoginUser) => {
  const { emailOrPhone, password } = loginInfo;
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  }).select('+password');

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
    id: user?.id,
  };

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
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { emailOrPhone } = decoded;

  //check if user is exist
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, '🔍❓ User not Found');
  }

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

// forget password
const forgetPasswordIntoDB = async (email: number) => {
  const existEmail = await User.findOne({ email: email }).select('+password');
  console.log(existEmail);
  if (!existEmail) {
    throw new AppError(status.UNAUTHORIZED, 'User not found.');
  }

  const JwtPayload = {
    email: existEmail.email,
    role: existEmail.role,
    id: existEmail.id,
  };
  const accessToken = createToken(
    // @ts-expect-error token
    JwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUrlLink = `${config.RESET_UI_LINK}?email=${existEmail?.email}&token=${accessToken}`;

  sendEmail(existEmail.email, resetUrlLink);
};

// change password

const changePasswordIntoDB = async (
  payload: { oldPassword: string; newPassword: string },
  token: JwtPayload,
) => {
  const existEmail = await User.findOne({ email: token?.emailOrPhone }).select(
    '+password',
  );

  if (!existEmail) {
    throw new AppError(status.UNAUTHORIZED, 'User not found.');
  }
  const comparePassword = await bcrypt.compare(
    payload?.oldPassword,
    existEmail?.password,
  );
  if (!comparePassword) {
    throw new AppError(status.FORBIDDEN, 'Your password is not correct');
  }
  const hasPassword = await bcrypt.hash(payload.newPassword, 5);
  const result = await User.findOneAndUpdate(
    { email: existEmail.email }, // ✅ this is correct for filtering by email
    { password: hasPassword }, // ✅ new password to set
    { new: true }, // ✅ optional: returns the updated document
  );

  return result;
};

// reset password
const resetPasswordIntoDB = async (
  payload: string,
  data: { newPassword: string; email: string },
) => {
  let decoded;
  try {
    decoded = jwt.verify(
      payload,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError(status.UNAUTHORIZED, 'User is not authorized');
  }
  if (!decoded) {
    throw new AppError(status.UNAUTHORIZED, 'User is not authorized');
  }

  const user = await User.findOne({ id: decoded.id });
  if (data.email != user?.email) {
    throw new AppError(status.UNAUTHORIZED, 'User is not authorized');
  }

  const hasPassword = await bcrypt.hash(data?.newPassword, 5);
  const result = await User.findOneAndUpdate(
    { email: user.email },
    { password: hasPassword },
    { new: true },
  );

  return result;
};

export const AuthServices = {
  loginUserIntoDB,
  refreshToken,
  forgetPasswordIntoDB,
  resetPasswordIntoDB,
  changePasswordIntoDB,
};
