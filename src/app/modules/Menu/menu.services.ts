import { JwtPayload } from 'jsonwebtoken';
// import { TJwtPayload } from '../types';
import { TMenu } from './menu.interface';
import { Menu } from './menu.model';
import AppError from '../../errors/AppError';
import queryBuilder from '../../builder/queryBuilder';
import MaleProvider from '../mealProvider/meal.provider.mode';

const createMenuForDayIntoDB = async (payload: TMenu, user: JwtPayload) => {
  // 1. Check if meal provider exists
  const mealProvider = await MaleProvider.findOne({
    authorShopId: user.id,
  });

  if (!mealProvider) {
    throw new AppError(404, 'Meal provider not found');
  }

  // 2. Check if menu already exists for this day
  const existingMenu = await Menu.findOne({
    author_id: user.id,
  });

  if (existingMenu) {
    throw new AppError(
      409, // Conflict status code
      `Menu already exists. Please update the existing menu.`,
    );
  }

  // 3. Create new menu
  const newMenuData = {
    ...payload,
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
  //   const result = await Restaurant.find({ id: user.author_id });
  const restorenet = new queryBuilder(
    Menu.find().populate('author_id').populate('shopId'),
    query,
  )
    .filter()
    .sort()
    .fields()
    .paginate();
  const meta = await restorenet.countTotal();
  const data = await restorenet.modelQuery;
  return { meta, data };
};
// const findMyMenu = async (payload) => {
//   console.log(payload);
// };
const findSingleMenu = async (id: string) => {
  const result = await Menu.findById(id);
  return result;
};

const findMyMenu = async (user: JwtPayload) => {
  console.log({ user });
  const result = await Menu.findOne({
    author_id: user?.id,
  });
  return result;
};

const updateMyMenu = async (payload: Partial<TMenu>, user: JwtPayload) => {
  const result = await Menu.findOneAndUpdate(
    { author_id: user?.id },
    payload,
    { new: true }, // return the updated document
  );

  if (!result) {
    throw new AppError(404, 'Menu not found for this user.');
  }

  return result;
};

export const menuServices = {
  createMenuForDayIntoDB,
  findAllMenuIntoDB,
  findMyMenu,
  updateMyMenu,
  findSingleMenu,
};
