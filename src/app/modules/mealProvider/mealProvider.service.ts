/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import queryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../User/user.constant';
import User from '../User/user.model';

import { JwtPayload } from 'jsonwebtoken';
import { TMealProvider } from './mealProvider.interface';
import { MealProvider } from '../mealProvider/mealProvider.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import mongoose from 'mongoose';

const createMealProviderIntoDB = async (
  payload: TMealProvider,
  file: any,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isUserExist = await User.findOne({ id: user.id }).session(session);
    
    if (!isUserExist) {
      throw new AppError(status.NOT_FOUND, 'User not found');
    }
    
    if (isUserExist?.isShop) {
      throw new AppError(
        status.FORBIDDEN,
        'You are not allowed to create shop',
      );
    }

    const isMealProviderExist = await MealProvider.findOne({
      userId: user.id,
    }).session(session);
    

    if (isMealProviderExist) {
      throw new AppError(status.CONFLICT, 'This user already shop create');
    }
    if (!file) {
      throw new AppError(status.BAD_REQUEST, 'Image is required');
    } else {
      const path = file.path;
      const name = payload.shopName.replace(/\s+/g, '_').toLowerCase();

      const { secure_url } = (await sendImageToCloudinary(name, path)) as {
        secure_url: string;
      };

      payload.shopLogo = secure_url;
    }

    
    payload.userId = user.id;

    payload.authorShopId = isUserExist._id;

    

    const newMealProvider = await MealProvider.create([payload], { session });
    if (!newMealProvider.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create Meal Provider');
    }

    isUserExist.isShop = true;
    isUserExist.role = USER_ROLE.mealProvider;
    await isUserExist.save({ session });

    await session.commitTransaction();
    await session.endSession();
    return newMealProvider[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllMealProviderIntoDB = async (query: Record<string, unknown>) => {
  const mealProvider = new queryBuilder(
    MealProvider.find().populate('authorShopId'),
    query,
  );
  const meta = await mealProvider.countTotal();
  const data = await mealProvider.modelQuery;

  return { data, meta };
};

const getMyMealProviderIntoDB = async (user: JwtPayload) => {
  const result = await MealProvider.findOne({ userId: user.id }).populate(
    'authorShopId',
  );
  return result;
};

const updateMealProviderIntoDB = async (
  payload: Partial<TMealProvider>,
  file: any,
  user: JwtPayload,
) => {
  const isExistMealProvider = await MealProvider.isMealProviderExists(user.id);
  if (!isExistMealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal Provider not found');
  }

  if (file) {
    const path = file.path;
    const name =
      (payload.shopName?.replace(/\s+/g, '_').toLowerCase() ??
        isExistMealProvider.shopName) ||
      isExistMealProvider.shopName;

    const { secure_url } = (await sendImageToCloudinary(name, path)) as {
      secure_url: string;
    };

    if (!secure_url) {
      throw new AppError(
        status.BAD_REQUEST,
        'Failed to upload image to Cloudinary',
      );
    }

    payload.shopLogo = secure_url;
  }

  const result = await MealProvider.findOneAndUpdate(
    { userId: user.id },
    payload,
    { new: true },
  );

  return result;
};

export const MealProviderServices = {
  createMealProviderIntoDB,
  updateMealProviderIntoDB,
  getMyMealProviderIntoDB,
  getAllMealProviderIntoDB,
};
