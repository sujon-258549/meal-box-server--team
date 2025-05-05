import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { contactServices } from './contactUs.services';
const createContact = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await contactServices.createContactIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});
const singleContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await contactServices.singleContactIntoDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});
const contactForMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await contactServices.contactForMeIntoDB(user, req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact created successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const contactController = { createContact, singleContact, contactForMe };
