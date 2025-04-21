/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TMenu } from './menu.interface';
import { Menu } from './menu.model';
import AppError from '../../errors/AppError';
import queryBuilder from '../../builder/queryBuilder';
import status from 'http-status';
import { searchableFields } from './menu.constant';
import MealProvider from '../mealProvider/mealProvider.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';



const createMenuForDayIntoDB = async (
  payload: TMenu,
  file: any,
  user: JwtPayload,
) => {
  const mealProvider = await MealProvider.findOne({
    authorShopId: user.id,
  });

  if (!mealProvider) {
    throw new AppError(status.NOT_FOUND, 'Meal provider not found');
  }

  const existingMenu = await Menu.findOne({
    author_id: user.id,
  });

  if (existingMenu) {
    throw new AppError(
      status.CONFLICT,
      `Menu already exists. Please update the existing menu.`,
    );
  }

  const name = file.filename;
  const path = file?.path;
  const imageUrl = (await sendImageToCloudinary(name, path)) as {
    secure_url: string;
  };

  const newMenuData = {
    ...payload,
    menuImage: imageUrl?.secure_url,
    shopId: mealProvider._id,
    author_id: user.id,
  };

  const result = await Menu.create(newMenuData);
  return result;
};
const findAllMenuIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const restorenet = new queryBuilder(
    Menu.find().populate('author_id').populate('shopId'),
    query,
  )
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();
  const meta = await restorenet.countTotal();
  const data = await restorenet.modelQuery;
  return { meta, data };
};

const findSingleMenu = async (id: string) => {
  const result = await Menu.findById(id);
  return result;
};

const findMyMenu = async (user: JwtPayload) => {
  const result = await Menu.findOne({
    author_id: user?.id,
  })
    .populate('author_id')
    .populate('shopId');
  return result;
};

const updateMyMenu = async (payload: Partial<TMenu>, user: JwtPayload) => {
  const result = await Menu.findOneAndUpdate({ author_id: user?.id }, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, 'Menu not found for this user.');
  }

  return result;
};

export const MenuServices = {
  createMenuForDayIntoDB,
  findAllMenuIntoDB,
  findMyMenu,
  updateMyMenu,
  findSingleMenu,
};
