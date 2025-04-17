import express from 'express';
import { UserControllers } from './user.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userValidation';
import auth from '../../utils/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-user',
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  UserControllers.findUser,
);
router.put(
  '/update-user',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  UserControllers.updateUser,
);

export const UserRoutes = router;
