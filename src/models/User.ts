import { Schema, Document, model } from 'mongoose';

// Define the interface for user data
export interface IUser extends Document {
  displayName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  emailVerified: boolean;
  password: string;
}

// Create the user schema
const userSchema = new Schema<IUser>({
  displayName: {
    firstName: {
        type: String,
    required: true,
    },

    lastName: {
        type: String,
    required: true,
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified: {
      type: Boolean,
      required: false,
      default: false
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true});

// Create and export the user model
export const UserModel = model<IUser>('user', userSchema);


