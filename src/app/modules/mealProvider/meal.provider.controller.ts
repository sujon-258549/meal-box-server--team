import httpStatus from 'http-status';

import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { mealProviderServes } from './meal.provider.serves';
import catchAsync from '../../utils/catchAsync';

const createMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await mealProviderServes.CreateMealProviderIntoDB(
    data,
    req.file,
    req?.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Meal Provider created successfully',
    data: result,
  });
});
const getAllMealProvider = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await mealProviderServes.GetAllMealProviderIntoDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal retrieved successfully',
    data: result,
  });
});
const getMyMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req?.user;
  const result = await mealProviderServes.getMyMealProviderIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My meal retrieved successfully',
    data: result,
  });
});
const updateMealProvider = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await mealProviderServes.UpdateMealProviderIntoDB(
    data,
    req.file,
    req?.user,
  );
  // console.log(req.file, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal Provider update successfully',
    data: result,
  });
});

export const mealProviderController = {
  createMealProvider,
  getMyMealProvider,
  getAllMealProvider,
  updateMealProvider,
};
