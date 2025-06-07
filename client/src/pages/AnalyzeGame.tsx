import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Arrow, Piece, Square } from 'react-chessboard/dist/chessboard/types';
import { Stack, Box, darken } from '@mui/material';
import { FinishedGame, Promotion } from '../types/types';
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
import AnalyzeGamePanel from '../components/AnalyzeGamePanel/AnalyzeGamePanel';
import { Chess, ChessInstance, Move } from 'chess.js';
import { useNavigate, useParams } from 'react-router-dom';
import { StockfishEngine } from '../stockfish/StockfishEngine';

export interface Params {
  currMoveNum: number;
  currFen: string;
  history: Move[];
  boardOrientation: 'white' | 'black';
  isStockfishActive: boolean;
  sfCalculations: ReturnType<StockfishEngine['handleOutput']> | null;
  bestMoveArrow: [Square, Square] | null;
}

const AnalyzeGame = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const scale = window.innerWidth < 450 ? 1 : 0.7;
  const [boardWidth, setBoardWidth] = useState<number>(
    Math.min(window.innerWidth, window.innerHeight) * scale
  );

  const engine = useRef<StockfishEngine | null>(null);
  const [game, setGame] = useState(() => new Chess());
  const originalGame = useMemo(() => new Chess(), []);
  const [gameInfo, setGameInfo] = useState<FinishedGame | null>(null);
  const [params, setParams] = useState<Params>({
    currMoveNum: 0,
    currFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    history: [] as Move[],
    boardOrientation: 'white',
    isStockfishActive: false,
    sfCalculations: null,
    bestMoveArrow: null,
  });

  // const copyActionGame = (
  //   game: ChessInstance,
  //   callback: (gameCopy: ChessInstance) => void
  // ) => {
  //   const gameCopy = { ...game };
  //   callback(gameCopy);
  //   setGame(gameCopy);
  // };

  const stoskfishFindBestMove = () => {
    if (!engine.current) {
      return;
    }
    engine.current.evaluatePosition(game.fen(), 37);
  };

  const positionOfKingInCheck = () => {
    if (game.in_checkmate() || game.in_check()) {
      const board = game.board();
      const turn = game.turn();

      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          const piece = board[i][j];
          if (piece?.type === 'k' && piece?.color === turn) {
            return piece;
          }
        }
      }
    }
  };

  const customPiecesStyle = () => {
    if (!game) return {};

    const styles: { [key: string]: React.CSSProperties } = {};

    const kingSquare = game.in_check() ? positionOfKingInCheck()?.square : null;
    if (kingSquare) {
      styles[kingSquare] = {
        boxShadow: 'inset 0 0 15px 10px rgba(255, 0, 0, 0.6)',
      };
    }

    const history = game.history({ verbose: true });
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      styles[lastMove.from] = {
        backgroundColor: darken('#ffcd038a', 0.2),
      };
      styles[lastMove.to] = {
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

    const moveResult = game.move(move);

    if (moveResult) {
      return true;
    }

    return false;
  };

  const isPieceDraggable = useCallback(
    (args: { piece: Piece; sourceSquare: Square }) => {
      const { piece } = args;
      return piece[0] === game.turn();
    },
    [game]
  );

  useEffect(() => {
    engine.current = new StockfishEngine();
    engine.current.onMessage(
      (out: ReturnType<StockfishEngine['handleOutput']>) => {
        if (out) {
          setParams((prev) => ({
            ...prev,
            sfCalculations: out,
          }));
        }
      }
    );
    return () => {
      engine.current?.stop();
      engine.current?.quit();
      engine.current = null;
    };
  }, []);

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

  useEffect(() => {
    if (gameId) {
      const fetchGame = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/get-game?id=${gameId}`,
            {
              method: 'GET',
              credentials: 'include',
            }
          );
          if (!res.ok) {
            console.error(res.statusText);
          }
          const { data } = await res.json();
          //   copyActionGame(game, (copy) => {
          //     copy.load_pgn(data.game.pgn);
          //   });
          originalGame.load_pgn(data.game.pgn);
          console.log(data.game.pgn);
          setParams((prev) => ({
            ...prev,
            history: originalGame.history({ verbose: true }),
          }));
          setGameInfo(data.game);
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      };

      fetchGame();
    } else {
      navigate('/not-found');
    }
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
      <Box width={boardWidth} height={boardWidth} sx={{ userSelect: 'none' }}>
        <Chessboard
          customDarkSquareStyle={{
            backgroundColor: darken('#43A047', 0.2),
          }}
          areArrowsAllowed={params.isStockfishActive}
          customArrows={
            params.isStockfishActive
              ? [
                  [
                    params.sfCalculations?.currBestMove.from as Square,
                    params.sfCalculations?.currBestMove.to as Square,
                    'rgb(0, 0, 128)',
                  ] as Arrow,
                ]
              : []
          }
          customPieces={customPieces}
          customSquareStyles={customPiecesStyle()}
          boardOrientation={params.boardOrientation}
          position={params.currFen}
          onPieceDrop={onPieceDrop}
          isDraggablePiece={isPieceDraggable}
          arePiecesDraggable={!game.game_over()}
          boardWidth={boardWidth}
          customBoardStyle={{
            width: 'max-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Box>
      <AnalyzeGamePanel
        boardOrientation="white"
        setParams={setParams}
        params={params}
        gameInfo={gameInfo}
        game={game}
        findBestMove={() => stoskfishFindBestMove()}
        engine={engine.current}
      />
    </Stack>
  );
};

export default AnalyzeGame;

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
