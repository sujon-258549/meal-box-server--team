import { model, Schema } from 'mongoose';
import { IBlogPost } from './blog.interface';

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    id: { type: String, required: true },
    date: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export const BlogPost = model<IBlogPost>('BlogPost', blogPostSchema);
