import express from 'express';
import { UserControllers } from './user.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userValidation';

const router = express.Router();

router.post(
  '/create-user',
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
