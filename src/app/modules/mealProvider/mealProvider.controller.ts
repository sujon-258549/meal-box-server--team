import httpStatus, { status } from 'http-status';

import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { MealProviderServices } from './mealProvider.service';

const createMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await MealProviderServices.createMealProviderIntoDB(
    data,
    req.file,
    req?.user,
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Meal Provider created successfully',
    data: result,
  });
});

const getAllMealProvider = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await MealProviderServices.getAllMealProviderIntoDB(query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Meal Provider retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getMyMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req?.user;
  const result = await MealProviderServices.getMyMealProviderIntoDB(data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My meal provider retrieved successfully',
    data: result,
  });
});
const updateMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await MealProviderServices.updateMealProviderIntoDB(
    data,
    req.file,
    req?.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal Provider updated successfully',
    data: result,
  });
});

export const MealProviderControllers = {
  createMealProvider,
  getMyMealProvider,
  getAllMealProvider,
  updateMealProvider,
};
