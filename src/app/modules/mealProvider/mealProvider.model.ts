import mongoose, { Schema } from 'mongoose';
import { TMealProvider } from './mealProvider.interface';

const providerSchema = new Schema<TMealProvider>({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  authorShopId: { type: String, required: true, unique: true }, //will be added service file
  shopAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  customerServiceContact: { type: String },
  website: { type: String },
  establishedYear: { type: Number, required: true }, //will be change here
  socialMediaLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  operatingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
    daysOpen: { type: [String], required: true },
  },
  paymentMethods: { type: [String], required: true },
  productCategories: { type: [String], required: true },
  shopLogo: { type: String },

  // rating: { type: Number },
  isActive: { type: Boolean, default: true },
});

// Create and export the model
const MealProvider = mongoose.model<TMealProvider>(
  'MealProvider',
  providerSchema,
);

export default MealProvider;
