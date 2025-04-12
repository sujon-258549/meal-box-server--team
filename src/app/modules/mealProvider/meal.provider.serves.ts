/* eslint-disable @typescript-eslint/no-explicit-any */
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
  console.log(file, user);
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

export const mealProviderServes = { CreateMealProviderIntoDB };
