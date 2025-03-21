import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Piece, Square } from 'react-chessboard/dist/chessboard/types';
import { Stack, Box, darken } from '@mui/material';
import { useSocket } from '../hooks/useSocket';
import { useGameEvents } from '../hooks/useGameEvents';
import { Promotion } from '../types/types';
import wP from '../assets/pieces/wP.svg';
import wN from '../assets/pieces/wN.svg';
import bK from '../assets/pieces/bK.svg';
import bP from '../assets/pieces/bP.svg';
import bN from '../assets/pieces/bN.svg';
import bB from '../assets/pieces/bB.svg';
import bQ from '../assets/pieces/bQ.svg';
import bR from '../assets/pieces/bR.svg';
import wB from '../assets/pieces/wB.svg';
import wK from '../assets/pieces/wK.svg';
import wQ from '../assets/pieces/wQ.svg';
import wR from '../assets/pieces/wR.svg';
import ActiveGamePanel from '../components/ActiveGamePanel/ActiveGamePanel';

const ActiveGame = () => {
  const { player } = useSocket();
  const { gameState, message, leaveGame, makeMove, timer } = useGameEvents();
  const scale = window.innerWidth < 450 ? 1 : 0.7;
  const [boardWidth, setBoardWidth] = useState<number>(
    Math.min(window.innerWidth, window.innerHeight) * scale
  );

  const boardOrientation =
    player?.id === gameState?.owner?.id
      ? gameState?.owner?.color
      : gameState?.opponent?.color;

  const customPiecesStyle = () => {
    if (!gameState) return {};

    const styles: { [key: string]: React.CSSProperties } = {};

    if (gameState.check && gameState.posOfKingInCheck) {
      styles[gameState.posOfKingInCheck.square] = {
        boxShadow: 'inset 0 0 5px 4px red',
      };
    }

    if (gameState.lastMove) {
      styles[gameState.lastMove.from] = {
        backgroundColor: darken('#ffcd038a', 0.2),
      };
      styles[gameState.lastMove.to] = {
        backgroundColor: darken('#ffcd038a', 0.2),
      };
    }

    return styles;
  };
  const onPieceDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: (piece[1].toLowerCase() ?? 'q') as Promotion,
    };

    const isValidMove =
      gameState?.validMoves.some(
        (m) => m.from === sourceSquare && m.to === targetSquare
      ) ?? false;

    isValidMove && makeMove(move);

    return isValidMove;
  };

  const isPieceDraggable = useCallback(
    (args: { piece: Piece; sourceSquare: Square }) => {
      const { piece } = args;
      const thisClientColor =
        player?.id === gameState?.owner?.id
          ? gameState?.owner?.color
          : gameState?.opponent?.color;
      return piece[0] === thisClientColor && !!gameState?.hasStarted;
    },
    [player, gameState]
  );

  useEffect(() => {
    const updateBoardWidth = () => {
      const scale = window.innerWidth < 450 ? 1 : 0.7;
      setBoardWidth(Math.min(window.innerWidth, window.innerHeight) * scale);
    };

    updateBoardWidth();
    window.addEventListener('resize', updateBoardWidth);

    return () => {
      window.removeEventListener('resize', updateBoardWidth);
    };
  }, []);

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      direction={'row'}
      flexWrap={'wrap'}
      gap={'20px'}
      height={'100%'}
      sx={{ py: { xs: '0px', sm: '50px' } }}
    >
      <Box width={boardWidth} height={boardWidth}>
        <Chessboard
          animationDuration={
            gameState?.type === 'blitz' || gameState?.type === 'bullet'
              ? 0
              : 300
          }
          customDarkSquareStyle={{
            backgroundColor: darken('#43A047', 0.2),
          }}
          //   customLightSquareStyle={{ backgroundColor: darken('#ffce03', 0.2) }}
          customPieces={customPieces}
          customSquareStyles={customPiecesStyle()}
          arePremovesAllowed={true}
          boardOrientation={boardOrientation === 'b' ? 'black' : 'white'}
          position={gameState?.fen}
          onPieceDrop={onPieceDrop}
          isDraggablePiece={isPieceDraggable}
          arePiecesDraggable={!gameState?.gameOver || gameState?.hasStarted} // false // false = > false
          boardWidth={boardWidth}
          customBoardStyle={{
            width: 'max-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Box>
      <ActiveGamePanel
        gameState={gameState}
        timer={timer}
        message={message}
        player={player}
        leaveGame={leaveGame}
      />
    </Stack>
  );
};

const customPieces = {
  wP: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wP} alt="wP" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  wN: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wN} alt="wN" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  wB: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wB} alt="wB" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  wR: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wR} alt="wR" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  wQ: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wQ} alt="wQ" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  wK: ({ squareWidth }: { squareWidth: number }) => (
    <img src={wK} alt="wK" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bP: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bP} alt="bP" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bN: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bN} alt="bN" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bB: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bB} alt="bB" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bR: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bR} alt="bR" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bQ: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bQ} alt="bQ" width={squareWidth - 5} height={squareWidth - 5} />
  ),
  bK: ({ squareWidth }: { squareWidth: number }) => (
    <img src={bK} alt="bK" width={squareWidth - 5} height={squareWidth - 5} />
  ),
};

export default ActiveGame;
