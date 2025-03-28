import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

export interface IGame extends Document {
  whitePlayer: mongoose.Types.ObjectId;
  blackPlayer: mongoose.Types.ObjectId;
  whiteRating: number;
  blackRating: number;
  pgn: string; // Contains all game moves, result, metadata
  winner: null | 'w' | 'b';
  gameType: 'bullet' | 'blitz' | 'rapid' | 'classical';
  createdAt: Date; // Automatically managed by Mongoose
  updatedAt: Date; // Automatically managed by Mongoose
  ranked: boolean;
  tempo: string;
  endedByTimeout: boolean;
  endedByDraw: boolean;
  endedByCheckmate: boolean;
  endedByStalemate: boolean;
  endedByResignation: boolean;
}

const GameSchema = new Schema<IGame>(
  {
    whitePlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blackPlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    whiteRating: { type: Number, required: true },
    blackRating: { type: Number, required: true },
    pgn: { type: String, required: true }, // Stores full game notation
    winner: { type: String, enum: ['w', 'b', null], default: null },
    gameType: {
      type: String,
      enum: ['bullet', 'blitz', 'rapid', 'classical'],
      required: true,
    },
    ranked: { type: Boolean, required: true },
    tempo: { type: String, required: true },
    endedByTimeout: { type: Boolean, default: false },
    endedByDraw: { type: Boolean, default: false },
    endedByCheckmate: { type: Boolean, default: false },
    endedByStalemate: { type: Boolean, default: false },
    endedByResignation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

type GameType = InferSchemaType<typeof GameSchema>;
export type { GameType };
export default mongoose.model<IGame>('Game', GameSchema);
