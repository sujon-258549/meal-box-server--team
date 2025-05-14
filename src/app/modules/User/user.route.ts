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
  auth('customer', 'mealProvider', 'admin'),
  upload.single('file'),
  UserControllers.uploadImage,
);
// get route
router.get(
  '/meal-provider',
  auth('admin'),
  UserControllers.getAllAllMealProvider,
);
router.get(
  '/user-meal-provider',
  auth('admin'),
  UserControllers.getAllUserAndMealProvider,
);
router.get('/', auth('admin'), UserControllers.getAllUser);

router.put(
  '/change-user-status',
  auth('admin'),
  ValidateRequest(UserValidations.changeUserStatusSchema),
  UserControllers.changeUserStatus,
);

export const UserRoutes = router;
