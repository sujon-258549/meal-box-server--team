import { z } from 'zod';

// Address Schema
export const addressSchema = z.object({
  village: z.string().min(1, 'Village is required'),
  district: z.string().min(1, 'District is required'),
  subDistrict: z.string().min(1, 'Sub-district is required'),
  post: z.string().min(1, 'Post is required'),
  postCode: z.string().min(1, 'Post code is required'),
});

// Register Schema
const createUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    address: addressSchema,
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    gender: z.enum(['male', 'female', 'other']),
    phoneNumber: z.string(),
    secondaryPhone: z.string().optional(),
    isShop: z.boolean().optional(),
    isBlock: z.boolean().optional(),
    isDelete: z.boolean().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    phoneNumber: z.string().optional(),
    secondaryPhone: z.string().optional(),
    address: addressSchema.optional(),
    isShop: z.boolean().optional(),
    isBlock: z.boolean().optional(),
    isDelete: z.boolean().optional(),
  }),
});

const changeUserStatusSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'User ID is required'),
    status: z.object({
      isBlock: z.boolean().optional(),
      isDelete: z.boolean().optional(),
    }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeUserStatusSchema,
};
