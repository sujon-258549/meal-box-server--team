import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-order/:menuId',
  auth('customer', 'mealProvider', 'admin'),
  orderController.createOrder,
);

router.get(
  '/my-order',
  auth('customer', 'mealProvider'),
  orderController.findMyOrder,
);
router.get('/all-order', auth('admin'), orderController.findAllOrder);
//get single order
router.get(
  '/:id',
  auth('customer', 'mealProvider'),
  orderController.getSingleOrder,
);

router.get(
  '/',
  auth('customer', 'mealProvider'),
  orderController.MealProviderReceivedOrder,
);

export const orderRouter = router;
