import { ReactNode, use, useEffect, useState } from 'react';
import { SocketContext } from '../../features/contexts/SocketContext';
import { io } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../features/redux/hooks';
import {
  setGamesList,
  setPlayerGames,
} from '../../features/redux/socketDataSlice';
import { ISocketContext } from '../../features/contexts/SocketContext';
import { useSnackbar } from '../../hooks/useSnackbar';
import {
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import InvitationSnackbar from '../InvitationSnackbar/InvitationSnackbar';
import { useNavigate } from 'react-router-dom';

interface Invitation {
  gameId: string;
  tempo: `${number}+${number}`;
  type: string;
  color: 'w' | 'b';
  invitedBy: { id: string; username: string };
  ranked: boolean;
}
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const gameList = useAppSelector((state) => state.socketData.gamesList);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const { showSnackbar } = useSnackbar();

  const [context, setContext] = useState<ISocketContext>({
    socket: null,
    player: null,
  });

  const handleInvitationResponse = (isAccepted: boolean) => {
    if (!context.socket) return;

    context.socket.emit(
      'invitationResponse',
      {
        invitationSenderId: invitation?.invitedBy.id,
        gameId: invitation?.gameId,
        isAccepted,
      },
      (gameId: string) => navigate(`/game/${gameId}`)
    );
    setInvitation(null);
  };

  useEffect(() => {
    if (context.socket) {
      context.socket.on('error', (data) => {
        showSnackbar(data, 'error');
      });

      context.socket.on('gamesList', (data) => {
        dispatch(setGamesList(data));
      });

      context.socket.on('playerGames', (data) => {
        console.log('playerGames', data);
        dispatch(setPlayerGames(data));
      });

      context.socket.on('invitation', (data) => {
        setInvitation(data);
      });

      context.socket.on('connected', ({ id, username, type }) => {
        setContext((prev) => ({
          socket: prev.socket,
          player: { id, username },
        }));

        if (type === 'guest') {
          localStorage.setItem('guestId', id);
        }

        console.log(`Connected as ${type}: `, username);
      });

      context.socket.on('disconnect', (reason) => {
        console.log('disonnected, reason:', reason);
      });

      context.socket.on('connect_error', (err) => {
        console.log(err.message); // prints the message associated with the error
      });
    }
    return () => {
      context.socket?.off('error');
      context.socket?.off('invitation');
      context.socket?.off('gamesList');
      context.socket?.off('connected');
      context.socket?.off('connect_error');
    };
  }, [context.socket]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL, {
      auth: {
        guestId: localStorage.getItem('guestId'),
      },
      autoConnect: false,
      withCredentials: true,
    });

    socket.connect();

    console.log('Socket connected');
    setContext({ player: null, socket });
    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
      setContext({ player: null, socket: null });
    };
  }, []);
  return (
    <SocketContext.Provider value={context}>
      {children}
      {invitation && (
        <InvitationSnackbar
          invitation={invitation}
          handleInvitationResponse={handleInvitationResponse}
        />
      )}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
