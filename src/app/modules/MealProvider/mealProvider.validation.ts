import { z } from 'zod';

// Social Media Links Schema
const socialMediaLinksSchema = z
  .object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  })
  .optional();

// Operating Hours Schema
const operatingHoursSchema = z.object({
  open: z.string().min(1, 'Opening time is required'),
  close: z.string().min(1, 'Closing time is required'),
  daysOpen: z
    .array(z.string().min(1))
    .nonempty('At least one open day is required'),
});

// Main TMealProvider Schema
const mealProviderSchema = z.object({
  body: z.object({
    shopName: z.string().min(1, 'Shop name is required'),
    ownerName: z.string().min(1, 'Owner name is required'),
    shopAddress: z.string().min(1, 'Shop address is required'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    customerServiceContact: z.string().optional(),
    website: z.string().url().optional(),
    establishedYear: z.number().min(1900).max(new Date().getFullYear()),
    socialMediaLinks: socialMediaLinksSchema,
    operatingHours: operatingHoursSchema,
    paymentMethods: z
      .array(z.string().min(1))
      .nonempty('At least one payment method is required'),
    productCategories: z
      .array(z.string().min(1))
      .nonempty('At least one category is required'),
    // rating: z.number().min(0).max(5).optional(),
  }),
});

export const MealProviderValidations = { mealProviderSchema };
