import { Request, Response } from 'express';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { IUser, UserModel } from '../models/User';
import { getUser, createUser, updateUser, deleteUser, auth, requestPasswordReset, resetPassword, getUserByEmail, verifyEmail, EmailVerificationService } from '../services/user.service';
import { deleteUserAndPosts } from '../services/post.service';
import { PostModel } from '../models/Post';
import { transport } from '../config/nodemailer';
import {  generateToken, verifyToken } from '../utils/token';




interface Params extends Request {
  _id: Types.ObjectId;
}

export const profile = async (req: Request<Params>,res: Response): Promise<any> => {
  const { _id } = req.user as IUser;
  try {
    const user = await getUser(UserModel, _id);
    if (!user) {
      return res.status(400).json({ message: 'No product found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

//TODO: Create Store

export const createAccount = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstName, lastName, email, password } = z.object({
        firstName: z.string().nonempty().min(3),
        lastName: z.string().nonempty().min(3),
        email: z.string().email().nonempty().min(6, 'email field must be valid'),
        password: z.string().nonempty().min(8, 'hello body')
    }).parse(req.body);
    const salt = await bcrypt.genSalt(10);

    const hashedPass = await bcrypt.hash(password, salt);
    const userDatas = {
        displayName: {
            firstName,
            lastName
        },
        email,
        password: hashedPass
    }
    const user = await createUser(UserModel, userDatas);
    const TokenOptions = { expiresIn: '10min' }
    const token = await generateToken(user._id, 'emailVerification', TokenOptions);
    await transport.sendMail({
      from: 'Francisco Inoque<hi@franciscoinoque.tech>',
      to: email,
      subject: 'Account Verification',
      html: `
      <p>To confirm your account, please click on the link below.</p>
      <br>
      <br>
      <a href="http://localhost:2812/api/users/request/password-reset?query=${token}">Confirma sua conta</a>
      `
      })
    res.status(201).json({message: 'Check your inbox, we have sent an account verification email.', token});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateAccount = async (req: Request<Params>, res: Response): Promise<any> => {
  const { _id } = req.params;
  try {
    const { firstName, lastName } = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    }).parse(req.body);
    
    const userDatas = {
        displayName: {
            firstName,
            lastName
        }   
    }
    const user = await updateUser(UserModel, _id, userDatas);
    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const deleteAccount = async (req: Request<Params>,res: Response): Promise<any> => {
  const { _id } = req.params;
  try {
    const user = await deleteUser(UserModel, _id);
    await deleteUserAndPosts(UserModel, PostModel, _id)
    if (!user) {
      return res.status(400).json({ message: 'No product found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const authenticationUser = async(req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const authUser = await auth(UserModel, email, password)
        if(!authUser) return res.status(403).json({message: 'you are not authorized'})
        return res.status(200).json(authUser)
    } catch (error) {
        return res.status(403).json(error)
    }
}

export const resquestingPasswordReset = async(req: Request, res: Response) => {
  const { email } = req.body as IUser;

  try {
     const token = await requestPasswordReset(UserModel, email)
     if(!token) return res.status(404).json({message: 'user no found'})
     await transport.sendMail({
    from: 'Francisco Inoque<hi@franciscoinoque.tech>',
    to: email,
    subject: 'Reset Password',
    html: `
    <p>Hello, to reset your password click on the link below.</p>
    <br>
    <br>
    <a href="http://localhost:2812/api/users/request/password-reset?query=${token}">Reset Password</a>
    `
    })
     return res.status(200).json(token)
  } catch (error) {
    console.log(error)
     res.status(500).json(error)
  }
}

export const resetingPassword = async(req: Request, res: Response) => {
  const { pass_token } = req.headers;

  const { newPassword } = req.body;
  let token = pass_token?.toString();
  try {
    if(!token || !token?.startsWith('Bearer')) {
      return res.status(401).json({message: 'you are not auhorized, no valid token'})
  }
    const payload = verifyToken(token.split(' ')[1], 'resetPassword')
    const user = await resetPassword(UserModel, payload.userID, newPassword)
    return res.status(200).json({message: 'Your password has been updated successfully.'})
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}


export const requestEmailVerification = async(req: Request, res: Response) => {
  const { email } = req.body

  try {
    const user = await getUserByEmail(UserModel, email);
    if(!user) {
      return res.status(404).json({message: 'user not found'})
    }
    const TokenOptions = { expiresIn: '10min' }
    const token = await generateToken(user._id, 'emailVerification', TokenOptions);
    await new EmailVerificationService().requestEmailVerification(email)
    return res.status(200).json(token)
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const emailVerification = async(req: Request, res: Response) => {
  const { emailverifytoken } = req.headers;
 
  let token = emailverifytoken?.toString();
  try {
    if(!token || !token?.startsWith('Bearer')) {
      return res.status(401).json({message: 'you are not auhorized, no valid token'})
  }
    const payload = verifyToken(token.split(' ')[1], 'emailVerification')
   const result = await verifyEmail(UserModel, payload?.userID)
   return res.status(200).json(result)
} catch(error) {
   return res.status(400).json(error)
}

}
