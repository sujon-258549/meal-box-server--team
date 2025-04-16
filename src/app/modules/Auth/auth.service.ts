import status from 'http-status';
import { TUser } from '../User/user.interface';
import User from '../User/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';

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

// forget password
const forgetPasswordIntoDB = async (email: number) => {
  console.log(email);
  const existEmail = await User.findOne({ email: email });
  if (!existEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found.');
  }

  const JwtPayload = {
    email: existEmail.email,
    role: existEmail.role,
    id: existEmail._id,
  };
  const accessToken = createToken(
    // @ts-expect-error token
    JwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUrlLink = `${config.RESET_UI_LINK}?email=${existEmail?.email}&token=${accessToken}`;
  console.log(resetUrlLink);
  sendEmail(existEmail.email, resetUrlLink);
};
// reset password
const resetPasswordIntoDB = async (
  payload: any,
  data: { newPassword: string; email: string },
) => {
  let decoded;
  try {
    decoded = jwt.verify(
      payload,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  }
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  }

  const user = await User.findOne({ _id: decoded.id });
  if (data.email != user?.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized');
  }
  console.log(user.email);
  const hasPassword = await bcrypt.hash(data?.newPassword, 5);
  const result = await User.findOneAndUpdate(
    { email: user.email }, // ✅ this is correct for filtering by email
    { password: hasPassword }, // ✅ new password to set
    { new: true }, // ✅ optional: returns the updated document
  );

  return result;
};

// change password

const changePasswordIntoDB = async (
  payload: { oldPassword: string; newPassword: string },
  token: JwtPayload,
) => {
  console.log({ token });
  const existEmail = await User.findOne({ email: token?.emailOrPhone });
  if (!existEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found.');
  }
  const comparePassword = await bcrypt.compare(
    payload?.oldPassword,
    existEmail?.password,
  );
  if (!comparePassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your password is not correct');
  }
  const hasPassword = await bcrypt.hash(payload.newPassword, 5);
  const result = await User.findOneAndUpdate(
    { email: existEmail.email }, // ✅ this is correct for filtering by email
    { password: hasPassword }, // ✅ new password to set
    { new: true }, // ✅ optional: returns the updated document
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
