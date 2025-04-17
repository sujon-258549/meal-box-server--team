import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDB(req.body);
  // console.log(result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});
const findUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.findUserIntoDB(req?.user);
  // console.log(result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
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

export const UserControllers = {
  createUser,
  updateUser,
  findUser,
};
