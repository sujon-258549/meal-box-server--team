export interface TMealProvider {
  shopName: string;
  shopAddress: string;
  authorShopId: string;
  shopLogo?: string;
  phoneNumber: string;
  website?: string;
  ownerName: string;
  establishedYear: number;
  productCategories: string[];
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
}
