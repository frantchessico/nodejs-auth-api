import express from 'express';
import { profileCtrl, createAccountCtrl, updateAccountCtrl, deleteAccountCtrl, authenticationUserCtrl, resquestingPasswordResetCtrl, resetPasswordCtrl, requestEmailVerificationCtrl, emailVerificationCtrl} from '../controllers/user.controller'; // Import your UserController
import { checkUserExists, isEmailVerified } from '../middlewares/verifyUser';
import { AUTH_GUARD } from '../middlewares/auth.guard';

const router = express.Router();



router.post('/users/new-account', checkUserExists, createAccountCtrl);
router.post('/auths', isEmailVerified, authenticationUserCtrl);
router.get('/users/me', AUTH_GUARD, profileCtrl);
router.put('/users/:id', AUTH_GUARD, updateAccountCtrl);
router.delete('/users/:id', AUTH_GUARD, deleteAccountCtrl);
router.post('/users/request/password-reset', resquestingPasswordResetCtrl);
router.post('/users/reset-password', resetPasswordCtrl);
router.post('/users/email-verification-request', requestEmailVerificationCtrl);
router.post('/users/email-verification', emailVerificationCtrl);


export default router;
