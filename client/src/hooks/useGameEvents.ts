import { useCallback, useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { GameState, Promotion } from '../types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Move, Square } from 'chess.js';
import { useAudio } from '../hooks/useAudio';
import moveSound from '../assets/sounds/move3.mp3';
import captureSound from '../assets/sounds/takingPieceMove.mp3';

export function useGameEvents() {
  const { socket } = useSocket(); // Get socket instance from context
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ owner: number; opponent: number }>({
    owner: 0,
    opponent: 0,
  });
  const [playMoveSound] = useAudio(moveSound);
  const [playCaptureSound] = useAudio(captureSound);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    let timeoutId: undefined | number = undefined;
    // LISTENING EVENTS
    socket.on('gameState', (data) => {
      if (!data.opponent) {
        setMessage('Waiting for others to connect...');
      } else {
        setMessage(null);
      }

      setGameState(data);
    });

    socket.on('gameRemoved', () => {
      setMessage('Game has been removed redirecting in 5 sec...');
      timeoutId = setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    socket.on('invitationDeclined', () => {
      setMessage('Game invitation declined, redirecting in 5 sec..');
      timeoutId = setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    socket.on('moveMade', (move: Move) => {
      if (move.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
    });

    socket.on('timerUpdate', (data) => {
      setTimer(data);
    });

    return () => {
      //   Clean up component-specific listeners
      socket.off('gameState');
      socket.off('gameRemoved');
      socket.off('timerUpdate');
      socket.off('invitationDeclined');
      socket.off('moveMade');
      timeoutId && clearTimeout(timeoutId);
    };
  }, [socket]);

  useEffect(() => {
    if (!gameId || !socket) return;

    const fetchGameState = () => {
      socket.emit('getGameState', { gameId }, (isSuccess: boolean) => {
        if (isSuccess) {
          console.log('connected');
        } else {
          socket.emit('reconnectToGame', { gameId }, (isSuccess: boolean) => {
            if (isSuccess) {
              console.log('reconnected');
            } else {
              navigate('/not-found');
            }
          });
        }
      });
    };

    const tm = setTimeout(() => fetchGameState(), 500);
    return () => clearTimeout(tm);
  }, [socket, navigate, gameId]);

  // EMITTING EVENTS
  const makeMove = useCallback(
    async (move: { from: Square; to: Square; promotion?: Promotion }) => {
      if (gameState)
        socket?.emit('makeMove', { gameId: gameState.gameId, move });
    },
    [gameState, socket]
  );

  const handleLeavingGame = useCallback(() => {
    if (gameState) {
      socket?.emit(
        'removePlayerFromTable',
        {
          gameId: gameState.gameId,
        },
        () => {
          navigate('/');
        }
      );
    }
  }, [gameState, socket, navigate]);

  const handleResign = useCallback(() => {
    if (gameState) {
      socket?.emit('resign', {
        gameId: gameState.gameId,
      });
    }
  }, [gameState, socket]);

  const handleOfferDraw = useCallback(() => {
    if (gameState) {
      socket?.emit('offerDraw', {
        gameId: gameState.gameId,
      });
    }
  }, [gameState, socket]);

  const handleOfferDrawResponse = useCallback(
    (isAccepted: boolean) => {
      if (gameState) {
        socket?.emit('offerDrawResponse', {
          gameId: gameState.gameId,
          isAccepted,
        });
      }
    },
    [gameState, socket]
  );

  const handleRematchOffer = useCallback(() => {
    if (gameState) {
      socket?.emit('offerRematch', {
        gameId: gameState.gameId,
      });
    }
  }, [gameState, socket]);

  const handleRematchResponse = useCallback(
    (isAccepted: boolean) => {
      if (gameState) {
        socket?.emit('offerRematchResponse', {
          gameId: gameState.gameId,
          isAccepted,
        });
      }
    },
    [gameState, socket]
  );

  return {
    gameState,
    makeMove,
    handleLeavingGame,
    handleResign,
    handleOfferDraw,
    handleOfferDrawResponse,
    handleRematchOffer,
    handleRematchResponse,
    message,
    setMessage,
    timer,
  };
}
