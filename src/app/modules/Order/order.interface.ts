import { Types } from 'mongoose';

export interface IMealItem {
  menu: string;
  price: number;
  description?: string;
  time?: string; // Added based on your sample data
}

export interface TDayMenu {
  day?: string; // Example: "Saturday"
  meals: IMealItem[];
}
// order interface
export interface TOrderMenu {
  customerId: string;
  paymentStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  transactionId: string | number;
  total_price: number;
  orderId: string;
  authorId: string;
  orders: TDayMenu[]; // Array of daily menus
  shopId: Types.ObjectId;
}
