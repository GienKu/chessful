import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
    id: string;
    whitePlayer: mongoose.Types.ObjectId;
    blackPlayer: mongoose.Types.ObjectId;
    whiteRating: number;
    blackRating: number;
    pgn: string; // Contains all game moves, result, metadata
    winner: null | "white" | "black";
    gameType: "bullet" | "blitz" | "rapid" | "classical";
    timeControl: { initial: number; increment: number };
    createdAt: Date;
}

const GameSchema = new Schema<IGame>(
    {
        id: { type: String, required: true },
        whitePlayer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blackPlayer: { type: Schema.Types.ObjectId, ref: "User", required: true },
        whiteRating: { type: Number, required: true },
        blackRating: { type: Number, required: true },
        pgn: { type: String, required: true }, // Stores full game notation
        winner: { type: String, enum: ["white", "black", null], default: null },
        gameType: {
            type: String,
            enum: ["bullet", "blitz", "rapid", "classical"],
            required: true,
        },
        timeControl: {
            initial: { type: Number, required: true },
            increment: { type: Number, required: true },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IGame>("Game", GameSchema);