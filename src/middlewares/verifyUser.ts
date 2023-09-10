import { Request, Response, NextFunction } from 'express';
import {  UserModel } from '../models/User';
import { EmailVerificationService, getUserByEmail } from '../services/user.service';
import { transport } from '../config/nodemailer';
import { generateToken } from '../utils/token';


export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  
  try {
    const user = await UserModel.findOne({email});

    if (user) {
      return res.status(403).json({ message: 'user already exists' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const isEmailVerified = async(req: Request, res: Response, next: NextFunction) => {
   const { email } = req.body

   try {
    const user = await getUserByEmail(UserModel, email);

    if(user?.emailVerified != true) {
      await new EmailVerificationService().requestEmailVerification(email)
      return res.status(403).json({message: 'Please verify your account before logging in'})
    }
    return next()
   } catch (error) {
       return res.status(400).json(error)
   }
}






