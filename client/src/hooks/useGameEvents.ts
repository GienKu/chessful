import { useEffect, useState } from 'react';
import { useSocket } from './useSocket';
import { GameState, Promotion } from '../types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Square } from 'chess.js';

export function useGameEvents() {
  const { socket, player } = useSocket(); // Get socket instance from context
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ owner: number; opponent: number }>({
    owner: 0,
    opponent: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    let timeoutId: undefined | number = undefined;
    // LISTENING EVENTS
    socket.on('gameState', (data) => {
      console.log(data);
      setGameState(data);
    });

    socket.on('gameRemoved', (data) => {
      setMessage('Game has been removed redirecting in 5 sec...');
      timeoutId = setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    socket.on('timerUpdate', (data) => {
      console.log(data);
      setTimer(data);
    });

    // // Component-specific listeners
    // socket.on('moveMade', (move) => {
    //   setGameState((prev) => prev ? { ...prev, lastMove: move } : null);
    // });

    // socket.on('gameTimer', (timerData) => {
    //   setGameState((prev) => prev ? { ...prev, timer: timerData } : null);
    // });

    return () => {
      //   Clean up component-specific listeners
      socket.off('gameState');
      socket.off('gameRemoved');
      socket.off('timerUpdate');
      timeoutId && clearTimeout(timeoutId);
    };
  }, [socket]);

  useEffect(() => {
    if (!gameId || !socket) return;

    const fetchGameState = () => {
      socket.emit('getGameState', { gameId }, (isSuccess: boolean) => {
        if (isSuccess) {
          console.log('here');
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

    const tm = setTimeout(() => fetchGameState(), 300);
    return () => clearTimeout(tm);
  }, [socket, navigate, gameId]);

  // EMITTING EVENTS
  const makeMove = async (move: {
    from: Square;
    to: Square;
    promotion?: Promotion;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      if (gameState) {
        socket?.emit(
          'makeMove',
          { gameId: gameState.gameId, move },
          (wasValid: boolean) => {
            resolve(wasValid);
          }
        );
      } else {
        resolve(false);
      }
    });
  };

  const leaveGame = () => {
    console.log('leaving game');
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
  };

  return { gameState, makeMove, leaveGame, message, setMessage, timer };
}
