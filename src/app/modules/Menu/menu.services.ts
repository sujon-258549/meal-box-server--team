/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TMenu } from './menu.interface';
import { Menu } from './menu.model';
import AppError from '../../errors/AppError';
import queryBuilder from '../../builder/queryBuilder';
import status from 'http-status';
import { searchableFields } from './menu.constant';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { MealProvider } from '../mealProvider/mealProvider.model';
import User from '../User/user.model';

const createMenuForDayInToDB = async (
  payload: TMenu,
  file: any,
  user: JwtPayload,
) => {
  const isUserExist = await User.findOne({ id: user.id });
  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  const mealProvider = await MealProvider.findOne({
    userId: user.id,
  });

  if (!mealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal provider not found');
  }

  const existingMenu = await Menu.findOne({
    shopId: mealProvider._id,
  });

  if (existingMenu) {
    throw new AppError(
      status.CONFLICT,
      `Menu already exists. Please update the existing menu.`,
    );
  }

  if (!file) {
    throw new AppError(status.BAD_REQUEST, 'Image is required');
  }
  const name = file.filename.replace(/\s+/g, '_').toLowerCase();
  const path = file?.path;
  const imageUrl = (await sendImageToCloudinary(name, path)) as {
    secure_url: string;
  };

  const totalPrice = payload.meals.reduce((acc, day) => {
    const { morning, evening, night } = day;
    const dayMealsTotalPrice =
      (morning?.price || 0) + (evening?.price || 0) + (night?.price || 0);
    return acc + dayMealsTotalPrice;
  }, 0);

  payload.totalPrice = Number(totalPrice);

  const newMenuData = {
    ...payload,
    menuImage: imageUrl?.secure_url,
    userId: user.id,
    author_id: isUserExist._id,
    shopId: mealProvider._id,
  };

  const result = await Menu.create(newMenuData);
  return result;
};

const findAllMenuFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const result = new queryBuilder(
    Menu.find().populate('author_id').populate('shopId'),
    query,
  )
    .filter()
    .paginate()
    .search(searchableFields)
    .sort()
    .fields();
  const meta = await result.countTotal();
  const data = await result.modelQuery;
  return { meta, data };
};

const findMyMenu = async (user: JwtPayload) => {
  const isExistMealProvider = await MealProvider.findOne({
    userId: user.id,
  });
  if (!isExistMealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal provider not found');
  }
  const result = await Menu.findOne({
    userId: user.id,
    shopId: isExistMealProvider._id,
  })
    .populate('author_id')
    .populate('shopId');

  return result;
};

const findSingleMenu = async (id: string) => {
  const result = await Menu.findOne({ $or: [{ _id: id }, { shopId: id }] })
    .populate('author_id')
    .populate('shopId');
  return result;
};

const updateMyMenu = async (payload: Partial<TMenu>, user: JwtPayload) => {
  const isExistMealProvider = await MealProvider.findOne({
    userId: user.id,
  });
  if (!isExistMealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal provider not found');
  }
  const result = await Menu.findOneAndUpdate({ userId: user.id }, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Menu not found for this user.');
  }

  return result;
};

const deleteMyMenuFromDB = async (menuId: string, user: JwtPayload) => {
  if (user.role === 'admin') {
    const result = await Menu.findByIdAndDelete(menuId);
    if (!result) {
      throw new AppError(status.NOT_FOUND, 'Menu not found');
    }
    return result;
  }

  const isExistMealProvider = await MealProvider.findOne({
    userId: user.id,
  });

  if (!isExistMealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal provider not found');
  }

  const result = await Menu.findOneAndDelete({
    _id: menuId,
    shopId: isExistMealProvider._id,
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Menu not found');
  }

  return result;
};

export const MenuServices = {
  createMenuForDayInToDB,
  findAllMenuFromDB,
  findMyMenu,
  updateMyMenu,
  findSingleMenu,
  deleteMyMenuFromDB,
};
