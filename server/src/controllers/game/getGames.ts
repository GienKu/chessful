import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import Game from '../../db/models/Game';
import User from '../../db/models/User';

// this controller is responsible for getting a player's information for needed profile page
// and it can be used to get any player's information for different purposes
export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const games = await Game.find({ _id: { $in: req.user.gamesPlayed } })
      .sort({ createdAt: -1 })
      .populate('whitePlayer', 'username')
      .populate('blackPlayer', 'username')
      .exec();

    if (!games || games.length === 0) {
      throw new AppError('No games found for the user');
    }

    const gameData = games.map((game) => {
      let endedBy = 'unknown';
      if (game.endedByTimeout) {
        endedBy = 'timeout';
      } else if (game.endedByDraw) {
        endedBy = 'draw';
      } else if (game.endedByCheckmate) {
        endedBy = 'checkmate';
      } else if (game.endedByStalemate) {
        endedBy = 'stalemate';
      } else if (game.endedByResignation) {
        endedBy = 'resignation';
      }

      return {
        id: game.id,
        whitePlayer: (game.whitePlayer as unknown as { username: string })
          .username,
        blackPlayer: (game.blackPlayer as unknown as { username: string })
          .username,
        whiteRating: game.whiteRating,
        blackRating: game.blackRating,
        pgn: game.pgn,
        winner: game.winner,
        gameType: game.gameType,
        tempo: game.tempo,
        ranked: game.ranked,
        createdAt: game.createdAt,
        endedBy,
      };
    });

    res.status(200).json({
      message: 'Games found. Success',
      data: {
        games: gameData,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
