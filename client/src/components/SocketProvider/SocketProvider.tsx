import { ReactNode, use, useEffect, useState } from 'react';
import { SocketContext } from '../../features/contexts/SocketContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../features/redux/hooks';
import { setGamesList } from '../../features/redux/socketDataSlice';
import { ISocketContext } from '../../features/contexts/SocketContext';
import { Alert, Snackbar } from '@mui/material';

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<{
    severity: 'error' | 'info' | 'success' | 'warning';
    msg: string;
  } | null>(null);

  const [context, setContext] = useState<ISocketContext>({
    socket: null,
    player: null,
  });

  useEffect(() => {
    if (context.socket) {
      // context.socket.on('gameCreated', (data) => {
      //   navigate(`/game/${data.gameId}`);
      // });

      // context.socket.on('gameJoined', (data) => {
      //   navigate(`/game/${data.gameId}`);
      // });

      context.socket.on('error', (data) => {
        setMessage({ msg: data, severity: 'error' });
      });

      context.socket.on('gamesList', (data) => {
        dispatch(setGamesList(data));
      });

      context.socket.on('newGuestId', (guestId) => {
        localStorage.setItem('guestId', guestId);
      });

      context.socket.on('connected', (player) => {
        setContext({ ...context, player });
        console.log('Connected as:', player);
      });

      return () => {
        context.socket?.off('error');
        context.socket?.off('gamesList');
        context.socket?.off('newGuestId');
        context.socket?.off('connected');
      };
    }
  }, [context.socket]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        guestId: localStorage.getItem('guestId'),
      },
      withCredentials: true,
    });
    setContext((prevContext) => ({ ...prevContext, socket }));
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={context}>
      {children}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {message?.msg}
        </Alert>
      </Snackbar>
    </SocketContext.Provider>
  );
};

export default SocketProvider;
