import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import User from './user.model';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { generateUserId } from './user.utils';

const createUserIntoDB = async (userData: TUser) => {
  userData.id = await generateUserId();
  const newUser = await User.create(userData);
  return newUser;
};

const updateUserIntoDB = async (userData: Partial<TUser>, user: JwtPayload) => {
  const updatedUser = await User.findOneAndUpdate({ id: user.id }, userData, {
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
  if (role === 'admin') {
    result = await User.findOne({ email: emailOrPhone }).select('-password');
  }

  return result;
};

const setImageIntoUser = async (
  file: Express.Multer.File,
  user: JwtPayload,
) => {
  
  const { id } = user;

  const isExistUser = await User.findOne({ id });

  if (!isExistUser) {
    return new AppError(status.NOT_FOUND, 'User not found');
  }
  if (file) {
    const path = file?.path;
    const name = isExistUser.fullName.replace(/\s+/g, '_').toLowerCase();

    const { secure_url } = (await sendImageToCloudinary(name, path)) as {
      secure_url: string;
    };
    if (!secure_url) {
      return new AppError(status.INTERNAL_SERVER_ERROR, 'Image not found');
    }
    isExistUser.profileImage = secure_url;
    return await isExistUser.save();
  }
  return isExistUser;
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getMeFromDB,
  setImageIntoUser,
};
