import express from 'express';
import { profile, createAccount, updateAccount, deleteAccount, authenticationUser, resquestingPasswordReset, resetingPassword, requestEmailVerification, emailVerification} from '../controllers/user.controller'; // Import your UserController
import { checkUserExists, isEmailVerified } from '../middlewares/verifyUser';
import { AUTH_GUARD } from '../middlewares/auth.guard';

const userRouter = express.Router();



userRouter.post('/users/new-account', checkUserExists, createAccount);
userRouter.post('/auths', isEmailVerified, authenticationUser);
userRouter.get('/users/me', AUTH_GUARD, profile);
userRouter.put('/users/:id', AUTH_GUARD, updateAccount);
userRouter.delete('/users/:id', AUTH_GUARD, deleteAccount);
userRouter.post('/users/request/password-reset', resquestingPasswordReset);
userRouter.post('/users/reset-password', resetingPassword);
userRouter.post('/users/email-verification-request', requestEmailVerification);
userRouter.post('/users/email-verification', emailVerification);


export default userRouter;
