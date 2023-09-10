import { Model, Types } from 'mongoose';
import { IPost } from '../models/Post'; // Import the Post model interface
import { IUser } from '../models/User';

export const getPost = async (model: Model<IPost>, postId: Types.ObjectId) => {
  const post = await model.findById(postId);
  return post;
}

export const createPost = async (model: Model<IPost>, postData: any) => {
  const post = await model.create(postData);
  return post;
}

export const updatePost = async (model: Model<IPost>, postId: Types.ObjectId, postData: any) => {
  const post = await model.findByIdAndUpdate(postId, postData, { new: true });
  return post;
}

export const deletePost = async (model: Model<IPost>, postId: Types.ObjectId) => {
  const post = await model.findByIdAndDelete(postId);
  return post;
}




export const deleteUserAndPosts = async (userModel: Model<IUser>, postModel: Model<IPost>, userId: Types.ObjectId) => {
  try {
    // Step 1: identify the user to be deleted
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Retrieve all post IDs related to the user
    const userPosts = await postModel.find({ author: userId }, '_id');

    // Step 3: Delete posts associated with these IDs
    const postIds = userPosts.map(post => post._id);
    await postModel.deleteMany({ _id: { $in: postIds } });

    // Step 4: Delete the user himself
    await userModel.findByIdAndDelete(userId);

    return true; // Indicates that the deletion was successful
  } catch (error) {
    // Handle errors, e.g. record not found
    return false; // Indicates that the deletion failed
  }
}
