import { Model, Types } from 'mongoose';

export type TMealProvider = {
  shopName: string;
  shopAddress: string;
  description: string;
  userId: string;
  authorShopId: Types.ObjectId;
  shopLogo?: string;
  phoneNumber: string;
  website?: string;
  ownerName: string;
  establishedYear: number;
  productCategories: string[];
  shopFeatures: string[];
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  rating?: number;
  isActive: boolean;
  operatingHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  paymentMethods: string[];
  customerServiceContact?: string;
};

export interface MealProviderModel extends Model<TMealProvider> {
  isMealProviderExists(id: string): Promise<TMealProvider | null>;
}
