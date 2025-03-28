import { useContext } from 'react';
import { SocketContext } from '../features/contexts/SocketContext';

export const useSocket = () => {
  const data = useContext(SocketContext);
  const socketRefresh = () => {
    data?.socket?.disconnect().connect();
  };
  return { socket: data.socket, player: data.player, socketRefresh };
};
