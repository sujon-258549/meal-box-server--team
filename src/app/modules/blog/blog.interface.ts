import { ObjectId } from 'mongoose';

export interface IBlogPost {
  title: string;
  excerpt: string;
  date: string;
  id: string;
  authorId: ObjectId;
  category: string;
  imageUrl?: string;
  slug: string;
}
