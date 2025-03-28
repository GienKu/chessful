import { Move, Piece, PieceColor, PieceType, Square } from 'chess.js';

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  rating: { bullet: number; blitz: number; rapid: number; classical: number };
  totalGames: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  friends: string[];
  createdAt: Date;
}

export interface GameState {
  gameId: string;
  type: GameType;
  tempo: string;
  ranked: boolean;
  owner: {
    id: string;
    username: string;
    rating: number | null;
    color: 'w' | 'b';
    connected: boolean;
  };
  opponent: {
    id: string;
    username: string;
    rating: number | null;
    color: 'w' | 'b';
    connected: boolean;
  };
  fen: string;
  hasStarted: boolean;
  gameOver: boolean;
  endedByTimeout: boolean;
  endedByDraw: boolean;
  whoResigned: 'w' | 'b' | null;
  whoDisconnected: 'w' | 'b' | null;
  drawOfferedById: string | null;
  winner: 'w' | 'b' | 'd' | null;
  turn: 'w' | 'b';
  checkmate: boolean;
  stalemate: boolean;
  insufficientMaterial: boolean;
  threefoldRepetition: boolean;
  fiftyMoveRule: boolean;
  draw: boolean;
  check: boolean;
  posOfKingInCheck?: {
    square: Square;
    color: PieceColor;
    type: PieceType;
  };
  validMoves: Move[];
  lastMove?: Move;
  rematchOfferedById: string | null;
}

export type Promotion = Exclude<PieceType, 'p' | 'k'>;
export type GameType = 'bullet' | 'blitz' | 'rapid' | 'classical';
