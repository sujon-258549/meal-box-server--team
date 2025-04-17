/* eslint-disable @typescript-eslint/no-explicit-any */
import queryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { sendImageCloudinary } from '../../utils/uploadImageCloudinary';
import { USER_ROLE } from '../User/user.constant';
import User from '../User/user.model';
import { TMaleProvider } from './meal.provider.interfaces';
import MaleProvider from './meal.provider.mode';

import { JwtPayload } from 'jsonwebtoken';

const CreateMealProviderIntoDB = async (
  payload: TMaleProvider,
  file: any,
  user: JwtPayload,
) => {
  const existId = await MaleProvider.findOne({ authorShopId: user?.id });
  if (existId) {
    throw new AppError(501, 'This user already shop create');
  }
  console.log('from meal provider create service', file, user);
  const path = file?.path;
  const name = payload.shopName;
  const shopLogo = await sendImageCloudinary(name, path);
  payload.authorShopId = user.id;
  //@ts-expect-error url
  payload.shopLogo = shopLogo?.secure_url;
  const result = await MaleProvider.create(payload);
  await User.findByIdAndUpdate(user.id, {
    role: USER_ROLE.mealProvider,
    isShop: true,
  });
  return result;
};
const GetAllMealProviderIntoDB = async (query: Record<string, unknown>) => {
  const mealProvider = new queryBuilder(MaleProvider.find(), query);
  const meta = await mealProvider.countTotal();
  const data = await mealProvider.modelQuery;

  return { data, meta };
};
const getMyMealProviderIntoDB = async (user: JwtPayload) => {
  const result = await MaleProvider.findOne({ authorShopId: user.id });
  return result;
};

const UpdateMealProviderIntoDB = async (
  payload: Partial<TMaleProvider>,
  file: any,
  user: JwtPayload,
) => {
  console.log(file, user);
  const path = file?.path;
  const name = payload?.shopName;
  const shopLogo = await sendImageCloudinary(name as string, path);
  payload.authorShopId = user.id;
  //@ts-expect-error url
  payload.shopLogo = shopLogo?.secure_url;
  const result = await User.findByIdAndUpdate(user.id, {
    payload,
    new: true,
  });

  return result;
};

export const mealProviderServes = {
  CreateMealProviderIntoDB,
  UpdateMealProviderIntoDB,
  getMyMealProviderIntoDB,
  GetAllMealProviderIntoDB,
};
