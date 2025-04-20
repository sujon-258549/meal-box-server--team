/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import queryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { sendImageCloudinary } from '../../utils/uploadImageCloudinary';
import { USER_ROLE } from '../User/user.constant';
import User from '../User/user.model';

import { JwtPayload } from 'jsonwebtoken';
import { TMealProvider } from './mealProvider.interface';
import MealProvider from './mealProvider.model';

const createMealProviderIntoDB = async (
  payload: TMealProvider,
  file: any,
  user: JwtPayload,
) => {
  console.log(payload);
  const existId = await MealProvider.findOne({ authorShopId: user?.id });
  if (existId) {
    throw new AppError(status.CONFLICT, 'This user already shop create');
  }
  const path = file?.path;
  const name = payload.shopName;

  const imageUrl = (await sendImageCloudinary(name, path)) as {
    secure_url: string;
  };

  payload.authorShopId = user.id;
  payload.shopLogo = imageUrl?.secure_url;

  const result = await MealProvider.create(payload);

  await User.findByIdAndUpdate(user.id, {
    role: USER_ROLE.mealProvider,
    isShop: true,
  });
  return result;
};

const getAllMealProviderIntoDB = async (query: Record<string, unknown>) => {
  const mealProvider = new queryBuilder(MealProvider.find(), query);
  const meta = await mealProvider.countTotal();
  const data = await mealProvider.modelQuery;

  return { data, meta };
};
const getMyMealProviderIntoDB = async (user: JwtPayload) => {
  const result = await MealProvider.findOne({ authorShopId: user.id });
  return result;
};

const updateMealProviderIntoDB = async (
  payload: Partial<TMealProvider>,
  file: any,
  user: JwtPayload,
) => {
  // let shopLogo;
  if (file) {
    const path = file.path;
    const name = payload.shopName;
    if (!name || !path) {
      throw new Error('Shop name and file path are required');
    }

    const cloudinaryResult = (await sendImageCloudinary(name, path)) as {
      secure_url: string;
    };

    if (!cloudinaryResult?.secure_url) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    payload.shopLogo = cloudinaryResult.secure_url;
  }

  payload.authorShopId = user.id;

  const result = await MealProvider.findOneAndUpdate(
    { authorShopId: user.id },
    payload,
    { new: true },
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  return result;
};

export const MealProviderServices = {
  createMealProviderIntoDB,
  updateMealProviderIntoDB,
  getMyMealProviderIntoDB,
  getAllMealProviderIntoDB,
};