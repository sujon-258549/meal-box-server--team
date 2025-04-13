import { z } from 'zod';

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .trim()
      .min(1, 'Name cannot be empty'),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .toLowerCase(),

    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .min(10, 'Phone number must be at least 10 characters'),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),

    role: z.enum(['customer', 'meal-provider']).optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
