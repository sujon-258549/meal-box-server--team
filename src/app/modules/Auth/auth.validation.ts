import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    emailOrPhone: z.string({
      required_error: 'Email or Phone number is required',
    }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({}),
});

export const AuthValidations = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
};
