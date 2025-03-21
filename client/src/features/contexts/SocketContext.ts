import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface ISocketContext {
  socket: Socket | null;
  player: { id: string; username: string } | null;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  player: null,
});
