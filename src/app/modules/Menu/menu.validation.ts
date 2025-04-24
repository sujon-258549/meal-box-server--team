import { z } from 'zod';

// Menu Item Validation for creating
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

// Menu item schema for updating
const updateMenuItemValidationSchema = z.object({
  menu: z.string().optional(),
  price: z.number().positive('Price must be a positive number').optional(),
});

// Day Menu Validation creating
const dayMenuValidationSchema = z.object({
  day: z.string().optional(),
  morning: menuItemValidationSchema.optional(),
  evening: menuItemValidationSchema.optional(),
  night: menuItemValidationSchema.optional(),
});

// Day-wise menu schema for updating
const updateDayMenuValidationSchema = z.object({
  day: z.string().optional(),
  morning: updateMenuItemValidationSchema.optional(),
  evening: updateMenuItemValidationSchema.optional(),
  night: updateMenuItemValidationSchema.optional(),
});

// Main Menu Validation for creating
const createMenuValidationSchema = z.object({
  body: z.object({
    meals: z
      .array(dayMenuValidationSchema, {
        required_error: 'Meals are required',
        invalid_type_error: 'Meals must be an array of day menus',
      })
      .nonempty('At least one day menu is required'),
  }),
});

// Main Menu update schema
const updateMenuValidationSchema = z.object({
  body: z.object({
    meals: z.array(updateDayMenuValidationSchema).optional(),
  }),
});

export const MenuValidations = {
  createMenuValidationSchema,
  updateMenuValidationSchema,
};
