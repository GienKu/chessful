import express from 'express';
import { userLoginController } from '../controllers/user/auth/userLogin';
import { sendPasswordResetLink } from '../controllers/user/auth/sendPasswordResetLink';
import { verifyPasswordResetToken } from '../controllers/user/auth/verifyPasswordResetLink';
import { userRegistration } from '../controllers/user/auth/userRegistration';
import { updateUserPassword } from '../controllers/user/auth/updateUserPassword';
import { auth } from '../middlewares/handleAuth';
import { linkAuth } from '../middlewares/handleLinkAuth';
import { verifyUserEmail } from '../controllers/user/auth/verifyUserEmail';
import { getUser } from '../controllers/user/getUser';
import { getPlayer } from '../controllers/user/getPlayer';
import { getPlayersQuery } from '../controllers/user/getPlayersQuery';
import { getUserFriends } from '../controllers/user/getUserFriends';
import { getInvitations } from '../controllers/user/getInvitations';
import { postFriendInvitation } from '../controllers/user/postFriendInvitation';
import { postFriendInvitationResponse } from '../controllers/user/postFriendInvitationResponse';

export const userRoutes = express.Router();

userRoutes.post('/api/login', userLoginController);

userRoutes.post('/api/register', userRegistration);

userRoutes.post('/api/logout', (req, res) => {
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

userRoutes.get('/api/player/:id', getPlayer);
userRoutes.get('/api/players', auth(), getPlayersQuery);
userRoutes.get('/api/user', auth(), getUser);
userRoutes.get('/api/friends', auth(), getUserFriends);
userRoutes.get('/api/invitations', auth(), getInvitations);

userRoutes.post('/api/send-friend-invitation', auth(), postFriendInvitation);
userRoutes.post(
  '/api/invitation-response',
  auth(),
  postFriendInvitationResponse
);
