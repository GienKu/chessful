import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from './useSocket';
import { GameState, Promotion } from '../types/types';
import { useNavigate, useParams } from 'react-router-dom';
import { Move, ShortMove, Square } from 'chess.js';
import { useAudio } from '../hooks/useAudio';
import moveSound from '../assets/sounds/move3.mp3';
import captureSound from '../assets/sounds/takingPieceMove.mp3';
import { EngineOutput, StockfishEngine } from '../stockfish/StockfishEngine';

export function useGameEvents() {
  const { socket } = useSocket(); // Get socket instance from context
  const { gameId } = useParams<{ gameId: string }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<{ owner: number; opponent: number }>({
    owner: 0,
    opponent: 0,
  });
  const engine = useRef<StockfishEngine | null>(null);

  const [playMoveSound] = useAudio(moveSound);
  const [playCaptureSound] = useAudio(captureSound);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    let timeoutId: undefined | number = undefined;
    // LISTENING EVENTS
    socket.on('gameState', (data: GameState) => {
      const gameState = data;
      if (!gameState.opponent) {
        setMessage('Waiting for others to connect...');
      } else {
        setMessage(null);
      }
      if (gameState?.againstComputer) {
        if (gameState?.drawOfferedById)
          socket?.emit('offerDrawResponse', {
            gameId: gameState.gameId,
            isAccepted: true,
          });
        if (gameState?.rematchOfferedById)
          socket?.emit('offerRematchResponse', {
            gameId: gameState.gameId,
            isAccepted: true,
          });
        if (
          gameState.opponent.color === 'w' &&
          gameState.hasStarted === false
        ) {
          engine.current?.evaluatePosition(
            gameState.fen,
            gameState?.engineDepth ?? 5
          );
        }
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

    socket.on('moveMade', (move: Move, state: GameState) => {
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
      if (gameState) {
        socket?.emit('makeMove', { gameId: gameState.gameId, move });
      }
    },
    [gameState, socket]
  );

  useEffect(() => {
    // Guard condition: Only proceed if we're in a game against the computer.
    if (!gameState?.againstComputer || !gameState.skillLevel) {
      // If an engine instance exists from a previous game, ensure it's cleaned up.
      if (engine.current) {
        engine.current.quit();
        engine.current = null;
      }
      return;
    }

    let isMounted = true;

    const setupEngine = async () => {
      console.log('Setting up new Stockfish engine instance...');
      const newEngine = new StockfishEngine();

      newEngine.onMessage((output: EngineOutput) => {
        if (output.type === 'bestmove') {
          console.log('Engine determined best move:', output.move);
          if (isMounted) {
            makeMove(output.move as ShortMove);
          }
        }

        if (output.type === 'info') {
          console.log(
            `Engine thinking... depth: ${output.depth}, score: ${output.cp}`
          );
        }
      });

      try {
        if (gameState.skillLevel)
          await newEngine.initialize({ skillLevel: gameState.skillLevel });

        if (isMounted) {
          engine.current = newEngine;
          console.log('Engine initialized and ready.');
          //if engine was initialized and game hasn't started make first move
          if (
            gameState.opponent.color === 'w' &&
            gameState.hasStarted === false
          ) {
            console.log("Computer's turn. Triggering engine evaluation...");
            engine.current.evaluatePosition(
              gameState.fen,
              gameState.engineDepth || 10
            );
          }
        } else {
          // If the component unmounted while we were initializing, quit the engine immediately.
          newEngine.quit();
        }
      } catch (error) {
        console.error('Failed to initialize Stockfish engine:', error);
      }
    };

    setupEngine();

    // The cleanup function
    return () => {
      isMounted = false;
      console.log('Cleaning up engine...');
      engine.current?.quit();
      engine.current = null; 
    };

    // This effect should re-run ONLY when a new computer game starts.
  }, [gameState?.againstComputer, gameState?.skillLevel]);

  useEffect(() => {
    if (
      engine.current &&
      gameState &&
      gameState.againstComputer &&
      gameState.turn === gameState.opponent.color
    ) {
      console.log("Computer's turn. Triggering engine evaluation...");
      engine.current.evaluatePosition(
        gameState.fen,
        gameState.engineDepth || 10
      );
    }
  }, [gameState?.fen, gameState?.turn]);

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
