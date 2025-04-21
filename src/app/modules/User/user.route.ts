import express from 'express';
import { UserControllers } from './user.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userValidation';
import auth from '../../utils/auth';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-user',
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.put(
  '/update-user',
  auth('admin', 'mealProvider', 'customer'),
  ValidateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser,
);

router.get(
  '/me',
  auth('admin', 'customer', 'mealProvider'),
  UserControllers.getMe,
);

router.post(
  '/upload',
  auth('customer', 'mealProvider'),
  upload.single('file'),
  UserControllers.uploadImage,
);

export const UserRoutes = router;
