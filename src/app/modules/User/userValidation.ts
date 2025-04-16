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
export const createUserValidationSchema = z.object({
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
    profileImage: z.string().url().optional(),
    nidNumber: z.string().optional(),
    isShop: z.boolean().optional(),
    isBlock: z.boolean().optional(),
    isDelete: z.boolean().optional(),
  }),
});

// You can now use:
// registerSchema.parse(data) or registerSchema.safeParse(data)

// export const createUserValidationSchema = z.object({
//   body: z.object({
//     name: z
//       .string({
//         required_error: 'Name is required',
//       })
//       .trim()
//       .min(1, 'Name cannot be empty'),

//     email: z
//       .string({
//         required_error: 'Email is required',
//       })
//       .email('Invalid email format')
//       .toLowerCase(),

//     phoneNumber: z
//       .string({
//         required_error: 'Phone number is required',
//       })
//       .min(10, 'Phone number must be at least 10 characters'),

//     password: z
//       .string({
//         required_error: 'Password is required',
//       })
//       .min(6, 'Password must be at least 6 characters'),

//     role: z.enum(['customer', 'meal-provider']).optional(),
//   }),
// });

export const UserValidations = {
  createUserValidationSchema,
};
