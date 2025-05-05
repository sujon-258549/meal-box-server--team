import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import User from './user.model';
import status from 'http-status';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { generateUserId } from './user.utils';
import queryBuilder from '../../builder/queryBuilder';

const createUserIntoDB = async (userData: TUser) => {
  userData.id = await generateUserId();
  const existMobile = await User.findOne({ phoneNumber: userData.phoneNumber });
  if (existMobile) {
    throw new AppError(409, 'Mobile number already exists');
  }
  const existEmail = await User.findOne({ email: userData.email });
  if (existEmail) {
    throw new AppError(409, 'Email already exists');
  }

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

const getAllUser = async (query: Record<string, unknown>) => {
  const user = new queryBuilder(User.find(), query)
    .paginate()
    .filter()
    .fields();
  const meta = await user.countTotal();
  const data = await user.modelQuery;
  return { meta, data };
};

const changeUserStatus = async (
  id: string,
  statusUpdate: { isBlock?: boolean; isDelete?: boolean },
) => {
  const user = await User.findById(id);
  if (!user) {
    return {
      success: false,
      message: 'User not found',
      user: null,
    };
  }

  // Apply updates based on flags
  if (statusUpdate.isDelete !== undefined) {
    user.isDelete = statusUpdate.isDelete;
  }

  if (statusUpdate.isBlock !== undefined) {
    user.isBlock = statusUpdate.isBlock;
  }

  await user.save();
  return user;
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getMeFromDB,
  setImageIntoUser,
  getAllUser,
  changeUserStatus,
};
