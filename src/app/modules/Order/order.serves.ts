/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';
import { TOrderMenu } from './order.interface';
import { Order } from './order.model';
import { status } from 'http-status';
import AppError from '../../errors/AppError';
import { sslServices } from '../sslCommeriz/sslCommeriz.servises';
import { Menu } from '../Menu/menu.model';
import queryBuilder from '../../builder/queryBuilder';

const createOrderIntoDB = async (
  payload: TOrderMenu,
  user: JwtPayload,
  id: string,
) => {
  console.log({ payload, user });

  // Assign user ID to the order
  payload.customerId = user.id;
  payload.orderId = id;
  const existMenu = await Menu.findById(id);
  if (!existMenu) {
    throw new AppError(status.UNAUTHORIZED, 'Author Id not Authorize');
  }
  payload.authorId = existMenu.author_id;
  //   Calculate the total price into days
  const totalPrice = payload.orders.reduce((acc, day) => {
    return (
      acc +
      (day.morning?.price || 0) +
      (day.evening?.price || 0) +
      (day.night?.price || 0)
    );
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
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = { paymentUrl: result };
  }
  return result; // Include total price in the response
};

const findMyOrderIntoDB = async (user: JwtPayload) => {
  const result = await Order.find({ customerId: user.id });
  return result;
};
const MealProviderIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const meal = new queryBuilder(Order.find({ authorId: user.id }), query);
  const meta = await meal.countTotal();
  const data = await meal.modelQuery;
  return { meta, data };
};

export const orderServes = {
  createOrderIntoDB,
  findMyOrderIntoDB,
  MealProviderIntoDB,
};
