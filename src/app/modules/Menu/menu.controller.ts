import { Request, Response } from 'express';
import { status } from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { MenuServices } from './menu.services';
import sendResponse from '../../utils/sendResponse';

const createMenuForDay = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  
  const result = await MenuServices.createMenuForDayInToDB(
    data,
    req.file,
    req?.user,
  );
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Menu Created successfully',
    data: result,
  });
});

const findMyMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await MenuServices.findMyMenu(req.user); //
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Menu retrieved successfully',
    data: result,
  });
});

const findAllMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await MenuServices.findAllMenuFromDB(req?.user, req?.query); //
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All Menu retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const findSingleMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuServices.findSingleMenu(id); //
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Menu retrieved successfully',
    data: result,
  });
});

const updateMyMenu = catchAsync(async (req: Request, res: Response) => {
  const result = await MenuServices.updateMyMenu(req.body, req?.user); //
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Menu Updated successfully',
    data: result,
  });
});

const deleteMyMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuServices.deleteMyMenuFromDB(id, req?.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Menu Deleted successfully',
    data: result,
  });
});

export const MenuControllers = {
  createMenuForDay,
  findAllMenu,
  findMyMenu,
  updateMyMenu,
  findSingleMenu,
  deleteMyMenu,
};
