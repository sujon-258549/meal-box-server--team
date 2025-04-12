import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'customer' | 'meal-provider';
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmailOrPhone(emailOrPhone: string): Promise<TUser>;
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
