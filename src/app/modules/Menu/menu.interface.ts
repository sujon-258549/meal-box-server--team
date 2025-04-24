import { Types } from 'mongoose';

export interface IMenuItem {
  menu: string;
  price: number;
}
export interface IDayMenu {
  day?: string;
  morning?: IMenuItem;
  evening?: IMenuItem;
  night?: IMenuItem;
}

export interface TMenu {
  meals: IDayMenu[];
  userId: string;
  author_id: Types.ObjectId;
  shopId: Types.ObjectId;
  menuImage: string;
}
