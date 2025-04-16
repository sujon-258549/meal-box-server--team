import { Request, Response } from 'express';

import httpStatus from 'http-status';

import config from '../../config';
import { sslServices } from './sslCommeriz.servises';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const tran_id = req.query.tran_id as string;
  const result = await sslServices.validatePaymentService(tran_id);

  if (result) {
    res.redirect(301, config.SUCCESS_URL as string);
  } else {
    res.redirect(301, config.FAIL_URL as string);
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment  successfully',
    data: result,
  });
});

export const sslController = { validatePayment };
