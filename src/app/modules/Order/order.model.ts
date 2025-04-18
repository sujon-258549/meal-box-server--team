import mongoose, { Schema } from 'mongoose';
import { TDayMenu, TOrderMenu } from './order.interface';

// Define Menu Item Schema
const MenuItemSchema = new Schema({
  menu: { type: String },
  price: { type: Number },
  description: { type: String },
});

// Define Daily Menu Schema
const DayMenuSchema = new Schema<TDayMenu>({
  day: { type: String },
  morning: { type: MenuItemSchema },
  evening: { type: MenuItemSchema },
  night: { type: MenuItemSchema },
});

// Define Main Menu Schema
const MenuSchema = new Schema<TOrderMenu>(
  {
    customerId: { type: String, required: true },
    transactionId: { type: String || Number },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    total_price: { type: Number },
    orderId: { type: String, required: true },
    authorId: { type: String, required: true },
    orderData: { type: [DayMenuSchema] }, // Array of daily menus
  },
  { timestamps: true },
);

// Define Mongoose Model
export const Order = mongoose.model<TOrderMenu>('order', MenuSchema);
