import 'socket.io';
import { IUser } from '../db/models/User';

declare module 'socket.io' {
  interface Socket {
    user?: IUser;
    guest?: { id: string; username: string };
    isAuthenticated: boolean;
  }
}
