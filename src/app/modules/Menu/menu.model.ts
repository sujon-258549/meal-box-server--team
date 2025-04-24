import { model, Schema } from 'mongoose';
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
    userId: { type: String, required: true },
    author_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MealProvider',
    },
    menuImage: { type: String, required: true },
    meals: { type: [DayMenuSchema], required: true },
  },
  { timestamps: true },
);

export const Menu = model<TMenu>('Menu', MenuSchema);
