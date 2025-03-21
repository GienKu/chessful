import jwt from 'jsonwebtoken';
import path from 'path';
import { Socket } from 'socket.io';
import User from '../db/models/User';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const JWT_PRIV_KEY = process.env.JWT_PRIV_KEY;

const parseJWTFromCookie = (cookie: string | undefined): string | null => {
  if (!cookie) return null;
  const match = cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
};

export const handleSocketAuth = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    const guestId = socket.handshake.auth.guestId;

    const token = parseJWTFromCookie(cookie);
    if (!JWT_PRIV_KEY) {
      throw new Error('JWT SECKRET not defined');
    }

    if (token) {
      jwt.verify(token, JWT_PRIV_KEY, async (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error'));
        }
        const user = await User.findOne({ _id: decoded?.sub }).exec();
        if (!user) {
          return next(new Error('Authentication error'));
        }
        socket.user = user || undefined;
        return next();
      });
    } else if (guestId) {
      // No token, allow as guest
      socket.guest = {
        id: guestId,
        username: `Guest_${guestId}`,
      };
      return next();
    } else {
      const newGuestId = `${Math.random().toString(36).substr(2, 9)}`;

      socket.guest = {
        id: newGuestId,
        username: `Guest_${newGuestId}`,
      };

      socket.emit('newGuestId', newGuestId);
    }
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
};
