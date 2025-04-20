import express from 'express';
import { AuthControllers } from './auth.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../utils/auth';

const router = express.Router();

router.post(
  '/login',
  ValidateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh-token',
  ValidateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post('/forget-password', AuthControllers.forgetPassword);
router.post(
  '/reset-password',

  AuthControllers.resetPassword,
);
router.post(
  '/change-password',
  auth('admin', 'customer', 'mealProvider'),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
