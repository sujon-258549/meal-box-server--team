import express from 'express';
import { UserControllers } from './user.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userValidation';
import auth from '../../utils/auth';

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
  auth('admin', 'mealProvider', 'customer'),
  UserControllers.updateUser,
);

router.get(
  '/me',
  auth('admin', 'customer', 'mealProvider'),
  UserControllers.getMe,
);

export const UserRoutes = router;
