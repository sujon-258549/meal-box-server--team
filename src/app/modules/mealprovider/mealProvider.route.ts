import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../utils/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import { MealProviderControllers } from './mealProvider.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { mealProviderValidations } from './mealProvider.validation';

const router = Router();

router.post(
  '/create-mealProvider',
  auth('customer'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ValidateRequest(mealProviderValidations.mealProviderSchema),
  MealProviderControllers.createMealProvider,
);

router.get('/', MealProviderControllers.getAllMealProvider);
router.get(
  '/my-meal-provider',
  auth('mealProvider'),
  MealProviderControllers.getMyMealProvider,
);
router.put(
  '/update-mealProvider',
  auth('mealProvider'),
  //   ValidateRequest(mealProviderValidation.mealProviderSchema),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  //   auth(UserRole.user),
  MealProviderControllers.updateMealProvider,
);
// router.get('/menu', auth(UserRole.restaurant), restaurantController.findMyMenu);

export const MealProviderRouters = router;
