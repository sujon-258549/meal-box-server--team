import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { AuthServices } from './auth.service';
import config from '../../config';
import httpStatus from 'http-status';
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { accessToken, refreshToken } = result;
  console.log(refreshToken);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken, refreshToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log('refreshToken', refreshToken);

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthServices.forgetPasswordIntoDB(email);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Reset link is gangrened  successfully',
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const data = req.body;
  if (!authorization) {
    throw new Error('Authorization header is missing');
  }
  const result = await AuthServices.resetPasswordIntoDB(authorization, data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Password reset  successfully',
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const token = req?.user;
  const result = await AuthServices.changePasswordIntoDB(body, token);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Password change  successfully',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
};
