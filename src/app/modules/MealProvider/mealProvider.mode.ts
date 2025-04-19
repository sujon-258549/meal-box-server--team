import mongoose, { Schema } from 'mongoose';
import { TMealProvider } from './mealProvider.interface';

const providerSchema = new Schema<TMealProvider>({
  shopName: { type: String, required: true },
  authorShopId: { type: String, required: true, unique: true },
  shopAddress: { type: String, required: true },
  shopLogo: { type: String },
  phoneNumber: { type: String, required: true },
  website: { type: String },
  ownerName: { type: String, required: true },
  establishedYear: { type: Number, required: true },
  productCategories: { type: [String], required: true },
  socialMediaLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  rating: { type: Number },
  isActive: { type: Boolean },
  operatingHours: {
    open: { type: String, required: true },
    close: { type: String, required: true },
    daysOpen: { type: [String], required: true },
  },
  paymentMethods: { type: [String], required: true },
  customerServiceContact: { type: String },
});

// Create and export the model
const MealProvider = mongoose.model<TMealProvider>(
  'MealProvider',
  providerSchema,
);

export default MealProvider;