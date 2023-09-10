import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../models/User';
import { generateToken } from '../utils/token';
import { transport } from '../config/nodemailer';



export const getUser = async (model: Model<IUser>, _id: Types.ObjectId) => {
  const user = await model.findById(_id);
  return user;
}

export const getUserByEmail = async (model: Model<IUser>, email: string) => {
  const user = await model.findOne({email});
  return user;
}

export const createUser = async (model: Model<IUser>, userData: any) => {
  const user = await model.create(userData);
  return user;
}

export const updateUser = async (model: Model<IUser>, _id: Types.ObjectId, userData: any) => {
  const user = await model.findByIdAndUpdate(_id, userData, { new: true });
  return user;
}

export const deleteUser = async (model: Model<IUser>, _id: Types.ObjectId) => {
  const user = await model.findByIdAndDelete(_id);
  return user;
}


//TODO: Auth User
export const auth = async (userModel: Model<IUser>, email: string, password: string) => {
  try {
   
    const user = await userModel.findOne({ email });
    if (!user) {
      return null;
    }


    const passwordMatch = await bcrypt.compare(password, user.password);


    if (!passwordMatch) {
      return null;
    }

    const token = generateToken(user._id, 'default')
    return token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication error.');
  }
}





//TODO: Reset Password
export const requestPasswordReset = async (model: Model<IUser>, email: string) => {
  try {
   
    const user = await model.findOne({ email });
    if (!user) {
      return null
    }
   const TokenOptions = { expiresIn: '15min' }
    const resetToken = generateToken(user._id, 'resetPassword', TokenOptions);
    return resetToken;
  } catch (error) {
    return error
  }
};


export const resetPassword = async (model: Model<IUser>, _id: string, newPassword: string) => {
 
  try {
    const user = await model.findById({_id});
    if (!user) {
      return null
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
 
    return true;
  } catch (error) {
    
    return error
  }
};





//TODO: Email Verification
export const verifyEmail = async (model: Model<IUser>, _id: string): Promise<any> => {
  try {
    const user = await model.findById(_id);
    if (!user) {
      return false;
    }
    user.emailVerified = true;
    await user.save();
    return true;
  } catch (error) {
   return error
  }
};





export class EmailVerificationService {
  async requestEmailVerification(email: string) {
    try {
      
      const user = await getUserByEmail(UserModel, email);

      
      if (!user) {
        throw new Error('User not found');
      }

      
      const tokenOptions = { expiresIn: '10min' };

    
      const token = await generateToken(user._id, 'emailVerification', tokenOptions);

      
      await transport.sendMail({
        from: 'Francisco Inoque<hi@franciscoinoque.tech>',
        to: email,
        subject: 'Account Verification',
        html: `
          <p>To confirm your account, please click on the link below.</p>
          <br>
          <br>
          <a href="http://localhost:2812/api/users/request/password-reset?query=${token}">Confirma sua conta</a>
        `,
      });

     
      return token;
    } catch (error) {
     
      throw error;
    }
  }
}