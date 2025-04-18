export interface IMenuItem {
  menu: string;
  price: number;
}
export interface IDayMenu {
  day?: string; // Example: "Saturday"
  morning?: IMenuItem;
  evening?: IMenuItem;
  night?: IMenuItem;
}

export interface TMenu {
  meals: IDayMenu[];
  author_id: string;
  shopId: string;
  menuImage: string;
  // mealsHash: string;
}
