import mongoose, { Schema } from 'mongoose';
import { IDayMenu, IMenuItem, TMenu } from './menu.interface';

const MenuItemSchema = new Schema<IMenuItem>({
  menu: { type: String, required: true },
  price: { type: Number, required: true },
});

const DayMenuSchema = new Schema<IDayMenu>({
  day: { type: String },
  morning: { type: MenuItemSchema },
  evening: { type: MenuItemSchema },
  night: { type: MenuItemSchema },
});

const MenuSchema = new Schema<TMenu>(
  {
    author_id: { type: String, required: true, ref: 'User' },
    shopId: {
      type: String,
      required: true,
      ref: 'MealProvider',
    },
    menuImage: { type: String, required: true },
    meals: { type: [DayMenuSchema], required: true },
    // mealsHash: {
    //   type: String,
    //   required: true,
    //   index: true,
    // },
  },
  { timestamps: true },
);

export const Menu = mongoose.model<TMenu>('Menu', MenuSchema);
