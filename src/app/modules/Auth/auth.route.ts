import express from 'express';
import { AuthControllers } from './auth.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../utils/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
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
  auth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.mealProvider),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
