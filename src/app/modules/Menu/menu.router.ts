import { Router } from 'express';
import auth from '../../utils/auth';
import { USER_ROLE } from '../User/user.constant';
import { menuController } from './menu.controller';

const router = Router();

router.post(
  '/create-menu',
  auth('mealProvider'),
  menuController.createMenuForDay,
);
router.get('/', menuController.findAllMenu);
router.get(
  '/:id',
  auth(USER_ROLE.mealProvider, USER_ROLE.customer),
  menuController.findSingleMenu,
);
router.get('/my-menu', auth(USER_ROLE.mealProvider), menuController.findMyMenu);

router.put(
  '/my-menu',
  auth(USER_ROLE.mealProvider),
  menuController.updateMyMenu,
);

export const menuRouter = router;
