import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = Router();


router.post(
  '/create-order/:id',
  auth('customer'),
  orderController.createOrder,
);
router.get('/my-order', auth('customer'), orderController.findMyOrder);

router.get(
  '/',
  auth('mealProvider'),
  orderController.MealProviderReceivedOrder,
);

export const orderRouter = router;
