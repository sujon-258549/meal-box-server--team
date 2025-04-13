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
    day: { type: [DayMenuSchema], required: true },
    author_id: { type: String, required: true },
  },
  { timestamps: true },
);

export const Menu = mongoose.model<TMenu>('Menu', MenuSchema);
