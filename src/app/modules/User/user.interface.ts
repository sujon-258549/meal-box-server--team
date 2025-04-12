// export type TUser = {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   role: 'customer' | 'mealProvider' | 'admin';
// };
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';
export interface TAddress {
  village: string;
  district: string;
  subDistrict: string;
  post: string;
  postCode: string;
}
export type TUser = {
  fullName: string; //full name
  email: string;
  password: string;
  role: 'admin' | 'mealProvider' | 'customer';
  address: TAddress;
  dateOfBirth: string; // corrected spelling from "dateOfBarth"
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  secondaryPhone?: string; // made optional if not always required
  isShop?: boolean;
  isBlock?: boolean;
  isDelete?: boolean;
};

export interface UserModel extends Model<TUser> {
  // isUserExistByCustomId(id: string): Promise<TUser>;
  // isUserExistByEmailOrPhone(emailOrPhone: string): Promise<TUser>;
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
