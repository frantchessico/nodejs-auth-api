import { Schema, Document, model, Types } from 'mongoose';

// Define the interface for post data
export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId; // Reference to the user who created the post
}

// Create the post schema
const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Reference to the User model
    required: true,
  },
}, { timestamps: true });

// Create and export the post model
export const PostModel = model<IPost>('post', postSchema);


