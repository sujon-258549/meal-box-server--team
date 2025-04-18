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
  ValidateRequest(MenuValidations.menuValidationSchema),
  MenuControllers.createMenuForDay,
);

router.get('/', MenuControllers.findAllMenu);
router.get('/my-menu', auth('mealProvider'), MenuControllers.findMyMenu);
router.get(
  '/:id',
  auth('mealProvider', 'customer'),
  MenuControllers.findSingleMenu,
);
router.get('/my-menu', auth('mealProvider'), MenuControllers.findMyMenu);

router.put('/my-menu', auth('mealProvider'), MenuControllers.updateMyMenu);

export const MenuRouters = router;
