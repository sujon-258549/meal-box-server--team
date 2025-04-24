import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';
export type TAddress = {
  village: string;
  district: string;
  subDistrict: string;
  post: string;
  postCode: string;
};
export type TUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'mealProvider' | 'customer';
  address: TAddress;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  secondaryPhone?: string;
  isShop?: boolean;
  isBlock?: boolean;
  isDelete?: boolean;
  profileImage: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
