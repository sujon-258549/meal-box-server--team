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
const createMealProviderSchema = z.object({
  body: z.object({
    shopName: z.string().min(1, 'Shop name is required'),
    shopAddress: z.string().min(1, 'Shop address is required'),
    shopLogo: z.string().url().optional(),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    website: z.string().url().optional(),
    ownerName: z.string().min(1, 'Owner name is required'),
    establishedYear: z.number().min(1900).max(new Date().getFullYear()),
    productCategories: z
      .array(z.string().min(1))
      .nonempty('At least one category is required'),
    socialMediaLinks: socialMediaLinksSchema,
    operatingHours: operatingHoursSchema,
    paymentMethods: z
      .array(z.string().min(1))
      .nonempty('At least one payment method is required'),
    customerServiceContact: z.string().optional(),
  }),
});
// For UPDATE: All fields optional, but validated if provided
const updateMealProviderSchema = z.object({
  body: z.object({
    shopName: z.string().min(1).optional(),
    shopAddress: z.string().min(1).optional(),
    shopLogo: z.string().url().optional(),
    phoneNumber: z.string().min(10).optional(),
    website: z.string().url().optional(),
    ownerName: z.string().min(1).optional(),
    establishedYear: z
      .number()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),
    productCategories: z.array(z.string().min(1)).optional(),
    socialMediaLinks: socialMediaLinksSchema,
    operatingHours: operatingHoursSchema.partial().optional(), // allow partial updates
    paymentMethods: z.array(z.string().min(1)).optional(),
    customerServiceContact: z.string().optional(),
  }),
});

export const mealProviderValidations = {
  createMealProviderSchema,
  updateMealProviderSchema,
};
