import { z } from 'zod';

// Menu Item Validation
const menuItemValidationSchema = z.object({
  menu: z.string({
    required_error: 'Menu item name is required',
    invalid_type_error: 'Menu item name must be a string',
  }),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive('Price must be a positive number'),
});

// Day Menu Validation
const dayMenuValidationSchema = z.object({
  day: z.string().optional(),
  morning: menuItemValidationSchema.optional(),
  evening: menuItemValidationSchema.optional(),
  night: menuItemValidationSchema.optional(),
});

// Main Menu Validation with the `body` wrapper
const menuValidationSchema = z.object({
  body: z.object({
    meals: z
      .array(dayMenuValidationSchema, {
        required_error: 'Meals are required',
        invalid_type_error: 'Meals must be an array of day menus',
      })
      .nonempty('At least one day menu is required'),
  }),
});

export const MenuValidations = {
  menuValidationSchema,
};
