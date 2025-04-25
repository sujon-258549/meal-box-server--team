import { Request, Response } from 'express';
import config from '../../config';
import { sslServices } from './sslCommeriz.servises';

import catchAsync from '../../utils/catchAsync';
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const tran_id = req.query.tran_id as string;
  const result = await sslServices.validatePaymentService(tran_id);

  console.log('result', result);

  if (result) {
    res.redirect(301, config.SUCCESS_URL as string);
  } else {
    res.redirect(301, config.FAIL_URL as string);
  }
});

export const sslController = { validatePayment };
