import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import User from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  console.log('from service file', userData);
  const newUser = await User.create(userData);
  return newUser;
};

const updateUserIntoDB = async (userData: Partial<TUser>, user: JwtPayload) => {
  console.log(userData);
  const updatedUser = await User.findByIdAndUpdate(user.id, userData, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

const getMeFromDB = async (emailOrPhone: string, role: string) => {
  let result = null;
  if (role === 'customer') {
    result = await User.findOne({ email: emailOrPhone }).select('-password');
  }

  if (role === 'mealProvider') {
    result = await User.findOne({ email: emailOrPhone }).select('-password');
  }

  return result;
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getMeFromDB,
};
