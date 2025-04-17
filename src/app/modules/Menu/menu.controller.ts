import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { menuServices } from './menu.services';
import sendResponse from '../../utils/sendResponse';
const createMenuForDay = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await menuServices.createMenuForDayIntoDB(data, req?.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Menu Create successfully',
    data: result,
  });
});
const findAllMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.findAllMenuIntoDB(req?.user, req?.query); //
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Menu retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const findSingleMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await menuServices.findSingleMenu(id); //
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One menu retrieved successfully',
    data: result,
  });
});
const findMyMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.findMyMenu(req?.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My menu retrieved successfully',
    data: result,
  });
});
const updateMyMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await menuServices.updateMyMenu(req.body, req?.user); //
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update my menu successfully',
    data: result,
  });
});

export const menuController = {
  createMenuForDay,
  findAllMenu,
  findMyMenu,
  updateMyMenu,
  findSingleMenu,
};
