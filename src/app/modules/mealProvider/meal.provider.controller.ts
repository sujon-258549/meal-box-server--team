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

export const mealProviderController = { createMealProvider };
