import { JwtPayload } from 'jsonwebtoken';
import { TOrderMenu } from './order.interface';
import { Order } from './order.model';
import { status } from 'http-status';
import AppError from '../../errors/AppError';
import { sslServices } from '../sslCommeriz/sslCommeriz.servises';
import { Menu } from '../Menu/menu.model';
import queryBuilder from '../../builder/queryBuilder';
import { MealProvider } from '../mealProvider/mealProvider.model';

const createOrderIntoDB = async (
  payload: TOrderMenu,
  user: JwtPayload,
  menuId: string,
) => {
  console.log({ payload, user, menuId });

  // Assign user ID to the order
  // payload.customerId = user.id;
  // payload.orderId = menuId;
  // console.log(menuId);
  const existMenu = await Menu.findById(menuId);
  console.log(existMenu);
  if (!existMenu) {
    throw new AppError(status.UNAUTHORIZED, 'Menu not found');
  }
  payload.customerId = user.id;
  payload.orderId = menuId;
  // //   Calculate the total price into days
  // console.log(payload.orders);

  // const existShop = await MealProvider.findOne({
  //   shopId: existMenu.shopId,
  // });
  const isExistMealProvider = await MealProvider.findOne({
    _id: existMenu.shopId,
  });

  if (!isExistMealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal Provider not found');
  }
  payload.shopId = isExistMealProvider._id;
  const totalPrice = payload.orders.reduce((acc, day) => {
    const dayMealsTotal =
      day.meals?.reduce((mealAcc, meal) => mealAcc + (meal.price || 0), 0) || 0;
    return acc + dayMealsTotal;
  }, 0);
  payload.total_price = totalPrice;
  //   transition id
  const digits = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  const bigIntNumber = BigInt(digits);
  payload.transactionId = String(bigIntNumber);
  const res = await Order.create(payload);
  console.log(res);

  let result;
  if (res) {
    result = await sslServices.insertPayment({
      total_amount: totalPrice,
      //  @ts-expect-error: tran_id is not defined in the type but is required for SSL services
      tran_id: bigIntNumber,
      // tran_id: String(bigIntNumber),
    });
    console.log('✅ SSLCommerz Payment URL:', result);
    result = { paymentUrl: result };
  }
  console.log(result);
  return result; // Include total price in the response
};

const findMyOrderIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const myOrder = new queryBuilder(
    Order.find({ customerId: user.id })
      .populate('customerId')
      .populate('orderId')
      .populate('authorId')
      .populate('shopId'),
    query,
  )
    .sort()
    .filter()
    .paginate()
    .fields();
  const meta = await myOrder.countTotal();
  const data = await myOrder.modelQuery;
  return { meta, data };
};

const getSingleOrderFromDB = async (userInfo: JwtPayload, orderId: string) => {
  console.log(userInfo, orderId);
  const res = await Order.findOne({ _id: orderId })
    .populate('customerId')
    .populate('orderId')
    .populate('authorId')
    .populate('shopId');
  console.log(res);
  return res;
};

const MealProviderIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const meal = new queryBuilder(
    Order.find({ authorId: user.id })
      .populate('customerId')
      .populate('orderId')
      .populate('authorId')
      .populate('shopId'),

    query,
  )
    .sort()
    .filter()
    .paginate()
    .fields();
  const meta = await meal.countTotal();
  const data = await meal.modelQuery;
  return { meta, data };
};

export const orderServes = {
  createOrderIntoDB,
  findMyOrderIntoDB,
  MealProviderIntoDB,
  getSingleOrderFromDB,
};
