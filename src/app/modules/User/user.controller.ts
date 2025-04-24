import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
 
  const result = await UserServices.createUserIntoDB(req.body);
  

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateUserIntoDB(req.body, req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User update successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { emailOrPhone, role } = req.user;

  const result = await UserServices.getMeFromDB(emailOrPhone, role);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is Retrieved successfully',
    data: result,
  });
});

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: 'No file uploaded',
      data: null,
    });
  }
  const result = await UserServices.setImageIntoUser(req.file, req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Image uploaded successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getMe,
  uploadImage,
};
