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

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All User Retrieved successfully',
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id, status } = req.body;
  const result = await UserServices.changeUserStatus(id, status);
  let message = 'User status updated successfully';

  if ('isBlock' in status) {
    message = status.isBlock
      ? 'User has been blocked'
      : 'User has been unblocked';
  }

  if ('isDelete' in status) {
    message = status.isDelete
      ? 'User has been deleted'
      : 'User has been restored';
  }

  // If both were provided, you can combine the messages
  if ('isBlock' in status && 'isDelete' in status) {
    message = `${status.isBlock ? 'Blocked' : 'Unblocked'} and ${status.isDelete ? 'deleted' : 'restored'} user successfully`;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message,
    data: result,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getMe,
  uploadImage,
  getAllUser,
  changeUserStatus,
};
