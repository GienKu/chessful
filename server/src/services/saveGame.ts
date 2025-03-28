import mongoose, { Document, Schema } from 'mongoose';
import { IGame } from '../db/models/Game';
import Game from '../db/models/Game';

export const saveGame = async (gameData: {
  whitePlayer: mongoose.Types.ObjectId;
  blackPlayer: mongoose.Types.ObjectId;
  whiteRating: number;
  blackRating: number;
  pgn: string;
  winner: 'w' | 'b' | null;
  gameType: GameType;
  ranked: boolean;
  tempo: `${number}+${number}`;
  endedByTimeout: boolean;
  endedByDraw: boolean;
  endedByCheckmate: boolean;
  endedByStalemate: boolean;
  endedByResignation: boolean;
}) => {
  try {
    const game = new Game(gameData);
    const savedGame = await game.save();

    // Update gamesPlayed and stats for both players
    const updatePlayerStats = async (
      playerId: mongoose.Types.ObjectId,
      stats: {
        isWinner: boolean;
        isDraw: boolean;
      }
    ) => {
      const update = {
        $inc: {
          totalGames: 1,
          winCount: stats.isWinner ? 1 : 0,
          lossCount: !stats.isWinner && !stats.isDraw ? 1 : 0,
          drawCount: stats.isDraw ? 1 : 0,
        },
        $push: { gamesPlayed: savedGame._id },
      };

      await mongoose.model('User').updateOne({ _id: playerId }, update).exec();
    };

    const whitePlayerUpdate = updatePlayerStats(gameData.whitePlayer, {
      isWinner: gameData.winner === 'w',
      isDraw: gameData.endedByDraw,
    });

    const blackPlayerUpdate = updatePlayerStats(gameData.blackPlayer, {
      isWinner: gameData.winner === 'b',
      isDraw: gameData.endedByDraw,
    });

    await Promise.all([whitePlayerUpdate, blackPlayerUpdate]);

    return savedGame;
  } catch (error) {
    console.error('Error saving game or updating player stats:', error);
    throw error;
  }
};
