import mongoose, { Schema } from 'mongoose';
import { TDayMenu, TOrderMenu } from './order.interface';

// Define Menu Item Schema
const MenuItemSchema = new Schema({
  menu: { type: String },
  price: { type: Number },
  description: { type: String },
  time: { type: String },
});

// Define Daily Menu Schema
const DayMenuSchema = new Schema<TDayMenu>({
  day: { type: String },
  meals: { type: [MenuItemSchema] },
});

// Define Main Menu Schema
const OrderSchema = new Schema<TOrderMenu>(
  {
    customerId: { type: String, required: true, ref: 'User' },
    transactionId: { type: String || Number },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    total_price: { type: Number },
    orderId: { type: String, required: true, ref: 'Menu' },
    authorId: { type: String, required: true, ref: 'User' },
    orders: { type: [DayMenuSchema] }, // Array of daily menus
  },
  { timestamps: true },
);

// Define Mongoose Model
export const Order = mongoose.model<TOrderMenu>('order', OrderSchema);
