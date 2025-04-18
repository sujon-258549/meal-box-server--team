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
  try {
    console.log('file', file, 'payload', payload);

    let shopLogo;
    if (file) {
      const path = file.path;
      const name = payload.shopName;
      if (!name || !path) {
        throw new Error('Shop name and file path are required');
      }

      const cloudinaryResult = await sendImageCloudinary(name, path);
      //@ts-ignore - Ensure TMaleProvider has shopLogo property
      if (!cloudinaryResult?.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }
      //@ts-ignore - Ensure TMaleProvider has shopLogo property
      payload.shopLogo = cloudinaryResult.secure_url;
    }

    payload.authorShopId = user.id;

    const result = await MaleProvider.findOneAndUpdate(
      { authorShopId: user.id },
      payload,
      { new: true },
    );

    if (!result) {
      throw new Error('User not found');
    }

    return result;
  } catch (error) {
    // Important: Don't try to send response here
    // Just throw or return the error for the route handler to manage
    throw error;
  }
};

export const mealProviderServes = {
  CreateMealProviderIntoDB,
  UpdateMealProviderIntoDB,
  getMyMealProviderIntoDB,
  GetAllMealProviderIntoDB,
};
