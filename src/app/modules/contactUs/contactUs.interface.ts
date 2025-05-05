import { ObjectId } from 'mongoose';

export interface IContact {
  name: string;
  email: string;
  phone: string;
  address: string;
  id: ObjectId; // Reference to the selected author
  sendId: string; // Reference to the selected author
  message: string;
}
