import { JwtPayload } from 'jsonwebtoken';
import { TOrderMenu } from './order.interface';
import { Order } from './order.model';
import { status } from 'http-status';
import AppError from '../../errors/AppError';
import { sslServices } from '../sslCommeriz/sslCommeriz.servises';
import { Menu } from '../Menu/menu.model';
import queryBuilder from '../../builder/queryBuilder';
import { MealProvider } from '../mealProvider/mealProvider.model';
import User from '../User/user.model';

const searchParams = ['shopId.shopName', 'paymentStatus'];
const createOrderIntoDB = async (
  payload: TOrderMenu,
  user: JwtPayload,
  menuId: string,
) => {
  const existMenu = await Menu.findById(menuId);

  if (!existMenu) {
    throw new AppError(status.UNAUTHORIZED, 'Menu not found');
  }
  const existUser = await User.findOne({ id: user.id });

  if (!existUser) {
    throw new AppError(status.UNAUTHORIZED, 'Menu not found');
  }
  payload.customerId = existUser._id.toString();
  payload.orderId = menuId;

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

  let result;
  if (res) {
    result = await sslServices.insertPayment({
      total_amount: totalPrice,
      //  @ts-expect-error: tran_id is not defined in the type but is required for SSL services
      tran_id: bigIntNumber,
      // tran_id: String(bigIntNumber),
    });

    result = { paymentUrl: result };
  }

  return result; // Include total price in the response
};

const findMyOrderIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const existUser = await User.findOne({ id: user?.id });
  if (!existUser) {
    throw new AppError(status.NOT_FOUND, 'Shop not found');
  }
  const myOrder = new queryBuilder(
    Order.find({ customerId: existUser._id })
      .populate({
        path: 'customerId',
        model: 'User',
        localField: 'customerId',
        foreignField: 'id',
        select: '',
      })
      .populate('orderId')
      .populate('shopId'),
    query,
  )
    .search(searchParams)
    .sort()
    .filter()
    .paginate()
    .fields();
  const meta = await myOrder.countTotal();
  const data = await myOrder.modelQuery;
  return { meta, data };
};

const getSingleOrderFromDB = async (userInfo: JwtPayload, orderId: string) => {
  const res = await Order.findOne({ _id: orderId })
    // .populate('customerId')
    .populate({
      path: 'customerId',
      model: 'User',
      localField: 'customerId',
      foreignField: 'id',
      select: '',
    })
    .populate('orderId')
    .populate('shopId');

  return res;
};

const MealProviderIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const existUser = await User.findOne({ id: user?.id });
  if (!existUser) {
    throw new AppError(status.NOT_FOUND, 'Shop not found');
  }
  const existShop = await MealProvider.findOne({
    authorShopId: existUser?._id,
  });
  console.log('..................................', existShop, user.id);
  if (!existShop) {
    throw new AppError(status.NOT_FOUND, 'Meal Provider not found');
  }
  const meal = new queryBuilder(
    Order.find({ shopId: existShop._id })
      .populate('customerId')
      .populate('orderId')
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
const allOrderIntoDB = async () => {
  const result = Order.find();
  return result;
};

export const orderServes = {
  createOrderIntoDB,
  findMyOrderIntoDB,
  MealProviderIntoDB,
  getSingleOrderFromDB,
  allOrderIntoDB,
};
