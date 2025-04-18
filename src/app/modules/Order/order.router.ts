import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = Router();

// router.post(
//   '/order',
//   auth(USER_ROLE.customer),
//   orderController.createOrder,
// );
router.post(
  '/create-order/:id',
  auth(USER_ROLE.customer),
  orderController.createOrder,
);
router.get('/my-order', auth(USER_ROLE.customer), orderController.findMyOrder);

router.get(
  '/',
  auth('mealProvider'),
  orderController.MealProviderReceivedOrder,
);

export const orderRouter = router;
