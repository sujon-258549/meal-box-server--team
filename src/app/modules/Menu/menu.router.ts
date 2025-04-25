import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../utils/auth';
import { MenuControllers } from './menu.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import ValidateRequest from '../../middlewares/validateRequest';
import { MenuValidations } from './menu.validation';

const router = Router();

router.post(
  '/create-menu',
  auth('mealProvider'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ValidateRequest(MenuValidations.createMenuValidationSchema),
  MenuControllers.createMenuForDay,
);

router.get('/', MenuControllers.findAllMenu);

router.get('/my-menu', auth('mealProvider'), MenuControllers.findMyMenu);

router.get(
  '/:id',
  // auth('mealProvider', 'customer'),
  MenuControllers.findSingleMenu,
);

router.put(
  '/update-menu',
  auth('mealProvider'),
  ValidateRequest(MenuValidations.updateMenuValidationSchema),
  MenuControllers.updateMyMenu,
);

router.delete(
  '/delete-menu/:id',
  auth('mealProvider', 'admin'),
  MenuControllers.deleteMyMenu,
);

export const MenuRouters = router;
