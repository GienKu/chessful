import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { Move } from 'chess.js';

const ActiveGame = () => {
  const { player } = useSocket();
  const {
    gameState,
    message,
    handleLeavingGame,
    handleResign,
    handleOfferDraw,
    handleOfferDrawResponse,
    handleRematchOffer,
    handleRematchResponse,
    makeMove,
    timer,
  } = useGameEvents();
  const scale = window.innerWidth < 450 ? 0.9 : 0.7;
  const [boardWidth, setBoardWidth] = useState<number>(
    Math.min(window.innerWidth, window.innerHeight) * scale
  );
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  const boardOrientation = useMemo(() => {
    return player?.id === gameState?.owner?.id
      ? gameState?.owner?.color
      : gameState?.opponent?.color;
  }, [player, gameState]);

  const customPiecesStyle = useCallback(() => {
    if (!gameState) return {};

    const styles: { [key: string]: React.CSSProperties } = {};

    if (gameState.check && gameState.posOfKingInCheck) {
      styles[gameState.posOfKingInCheck.square] = {
        boxShadow: 'inset 0 0 15px 10px rgba(255, 0, 0, 0.6)',
      };
    }

    if (gameState.lastMove) {
      styles[gameState.lastMove.from] = {
        backgroundColor: darken('#ffcd038a', 0.2),
      };
      styles[gameState.lastMove.to] = {
        backgroundColor: darken('#ffcd038a', 0.2),
      };
      moveFrom &&
        (styles[moveFrom] = {
          backgroundColor: darken('#ffcd038a', 0.2),
        });
    }

    return styles;
  }, [gameState, moveFrom]);

  const getPlayerColor = () => {
    return gameState?.owner.id === player?.id
      ? gameState?.owner.color
      : gameState?.opponent.color;
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
        (m) =>
          m.from === sourceSquare &&
          m.to === targetSquare &&
          getPlayerColor() === gameState.turn
      ) ?? false;

    if (isValidMove) {
      makeMove(move);
    }

    return isValidMove;
  };

  const onSquareClick = useCallback(
    (square: Square, piece: Piece | undefined) => {
      // from square
      if (
        gameState?.validMoves.some(
          (m) =>
            m.from === square && piece && getPlayerColor() === gameState.turn
        )
      ) {
        setMoveFrom(square);
        return;
      }

      // to square
      const foundMove =
        gameState?.validMoves.find(
          (m) => m.from === moveFrom && m.to === square
        ) ?? false;

      // valid move
      if (foundMove && gameState?.opponent) {
        if (isPromotionMove(foundMove)) {
          setMoveTo(square);
          setShowPromotionDialog(true);
          return;
        }
        makeMove(foundMove);
        setMoveFrom(null);
        setMoveTo(null);
        return;
      }
      return;
    },
    [gameState, moveFrom, getPlayerColor, isPromotionMove, makeMove]
  );

  const onPromotionPieceSelect = useCallback(
    (piece?: Piece, promoteFromSquare?: Square, promoteToSquare?: Square) => {
      // if no piece passed then user has cancelled dialog, don't make move and reset
      if (piece && moveFrom && moveTo) {
        makeMove({
          from: moveFrom,
          to: moveTo,
          promotion: (piece[1].toLowerCase() ?? 'q') as Promotion,
        });
      }
      setMoveFrom(null);
      setMoveTo(null);
      setShowPromotionDialog(false);
      return true;
    },
    [moveFrom, moveTo, makeMove]
  );

  const isPieceDraggable = useCallback(
    (args: { piece: Piece; sourceSquare: Square }) => {
      const { piece } = args;
      const thisClientColor =
        player?.id === gameState?.owner?.id
          ? gameState?.owner?.color
          : gameState?.opponent?.color;
      return piece[0] === thisClientColor;
    },
    [player, gameState]
  );

  useEffect(() => {
    const updateBoardWidth = () => {
      const scale = window.innerWidth < 450 ? 0.9 : 0.7;
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
      mt={'10px'}
      justifyContent={'center'}
      alignItems={'center'}
      direction={{ md: 'column', lg: 'row' }}
      gap={'20px'}
      height={'100%'}
      sx={{ py: { xs: '0px', sm: '50px' } }}
    >
      <Box
        style={{ width: boardWidth, height: boardWidth }}
        sx={{ userSelect: 'none' }}
      >
        <Chessboard
          showPromotionDialog={showPromotionDialog}
          onPromotionPieceSelect={onPromotionPieceSelect}
          onSquareClick={onSquareClick}
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
          arePiecesDraggable={!gameState?.gameOver && !!gameState?.opponent}
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
        handleLeavingGame={handleLeavingGame}
        handleResign={handleResign}
        handleOfferDraw={handleOfferDraw}
        handleOfferDrawResponse={handleOfferDrawResponse}
        handleRematchOffer={handleRematchOffer}
        handleRematchResponse={handleRematchResponse}
      />
    </Stack>
  );
};

const isPromotionMove = (foundMove: Move) => {
  return (
    (foundMove.color === 'w' &&
      foundMove.piece === 'p' &&
      foundMove.to[1] === '8') ||
    (foundMove.color === 'b' &&
      foundMove.piece === 'p' &&
      foundMove.to[1] === '1')
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
