export interface TOrderItem {
  menu: string;
  price: number;
  description?: string;
  time?: string; // Added based on your sample data
}

export interface TDayMenu {
  day?: string; // Example: "Saturday"
  morning?: TOrderItem;
  evening?: TOrderItem;
  night?: TOrderItem;
}
// order interface
export interface TOrderMenu {
  customerId: string;
  paymentStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  transactionId: string | number;
  total_price: number;
  orderId: string;
  authorId: string;
  orderData: TDayMenu[]; // Array of daily menus
}
