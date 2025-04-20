import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { MealProviderRouters } from '../modules/MealProvider/mealProvider.route';
import { MenuRouters } from '../modules/Menu/menu.router';
import { SSLRoutes } from '../modules/sslCommeriz/sslCommeriz.router';
import { orderRouter } from '../modules/Order/order.router';

const router = Router();

const routerModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/customers',
    route: orderRouter,
  },
  {
    path: '/meal-provider',
    route: MealProviderRouters,
  },
  {
    path: '/menu',
    route: MenuRouters,
  },
  {
    path: '/ssl',
    route: SSLRoutes,
  },
  {
    path: '/order',
    route: orderRouter,
  },
];

routerModules.forEach((route) => router.use(route.path, route.route));

export default router;
