import Contact from './contactUs.model';
import { IContact } from './contactUs.interface';
import { JwtPayload } from 'jsonwebtoken';
import queryBuilder from '../../builder/queryBuilder';
import User from '../User/user.model';
import AppError from '../../errors/AppError';
const createContactIntoDB = async (userData: IContact) => {
  console.log(userData);
  const existUser = await User.findOne({ id: userData.sendId });

  // This condition is backwards - you're throwing if user EXISTS
  if (!existUser) {
    // Changed this condition
    throw new AppError(401, 'user not exist');
  }
  // @ts-expect-error user
  userData.id = existUser._id;
  const newContact = await Contact.create(userData); // Changed variable name for clarity
  return newContact;
};
const contactForMeIntoDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  console.log(user.id);
  const newUser = new queryBuilder(
    Contact.find({ sendId: user.id }).populate('id'),
    query,
  )
    .sort()
    .fields()
    .filter();
  const meta = await newUser.countTotal();
  const data = await newUser.modelQuery;

  return { meta, data };
};
const singleContactIntoDB = async (id: string) => {
  const newUser = await Contact.findById(id).populate('sendId');
  return newUser;
};

export const contactServices = {
  createContactIntoDB,
  contactForMeIntoDB,
  singleContactIntoDB,
};
