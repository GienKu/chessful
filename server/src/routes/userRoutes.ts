// @deno-types="@types/express"
import express from 'express';
import { userLoginController } from '../controllers/user/auth/userLogin';
import { sendPasswordResetLink } from '../controllers/user/auth/sendPasswordResetLink';
import { verifyPasswordResetToken } from '../controllers/user/auth/verifyPasswordResetLink';
import { userRegistration } from '../controllers/user/auth/userRegistration';
import { updateUserPassword } from '../controllers/user/auth/updateUserPassword';
import { auth } from '../middlewares/handleAuth';
import { linkAuth } from '../middlewares/handleLinkAuth';
import { verifyUserEmail } from '../controllers/user/auth/verifyUserEmail';

export const userRoutes = express.Router();

userRoutes.post('/api/login', userLoginController);

userRoutes.post('/api/register', userRegistration);

userRoutes.post('/api/logout', auth(), (req, res) => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Logout successful' });
});

userRoutes.get('/api/verify-email', linkAuth, verifyUserEmail);

userRoutes.post('/api/send-password-reset-link', sendPasswordResetLink);

userRoutes.get(
  '/api/verify-password-reset-link',
  linkAuth,
  verifyPasswordResetToken
);

userRoutes.patch('/api/update-password', auth(), updateUserPassword);
