import { Request, Response } from 'express';
import { status } from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { orderServes } from './order.serves';
import sendResponse from '../../utils/sendResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const { menuId } = req.params;

  const result = await orderServes.createOrderIntoDB(data, req?.user, menuId);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Order create successfully',
    data: result,
  });
});

const findMyOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServes.findMyOrderIntoDB(req?.user, req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Order retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const findAllOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderServes.allOrderIntoDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All Order retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const result = await orderServes.getSingleOrderFromDB(user, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Order retrieved successfully',
    data: result,
  });
});

const MealProviderReceivedOrder = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderServes.MealProviderIntoDB(req?.user, req.query);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'My retrieved meal successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

export const orderController = {
  createOrder,
  MealProviderReceivedOrder,
  findMyOrder,
  getSingleOrder,
  findAllOrder,
};
