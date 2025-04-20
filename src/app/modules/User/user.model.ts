import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { TAddress, TUser, UserModel } from './user.interface';
import config from '../../config';

const addressSchema = new Schema<TAddress>(
  {
    village: { type: String, required: true },
    district: { type: String, required: true },
    subDistrict: { type: String, required: true },
    post: { type: String, required: true },
    postCode: { type: String, required: true },
  },
  // { _id: false },
);

const userSchema = new Schema<TUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'mealProvider', 'customer'],
      default: 'customer',
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    secondaryPhone: {
      type: String,
      required: true,
    },
    isShop: {
      type: Boolean,
      default: false,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // hashing password and save into DB
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistByEmailOrPhone = async function (emailOrPhone) {
  // const user = this;
  return await this.findOne({
    $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
  });
};

const User = model<TUser, UserModel>('User', userSchema);

export default User;
