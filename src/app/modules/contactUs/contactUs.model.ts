import { Schema, model } from 'mongoose';
import { IContact } from './contactUs.interface';

// Mongoose Schema
const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [6, 'Phone number must be at least 6 digits'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [5, 'Address must be at least 5 characters'],
    },
    id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Author selection is required'],
      ref: 'User', // Assuming this references a User model
    },
    sendId: {
      type: String,
      required: [true, 'Author selection is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Create and export the Model
const Contact = model<IContact>('Contact', contactSchema);
export default Contact;
