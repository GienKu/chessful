import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import Game from '../../db/models/Game';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas';

// this controller is responsible for getting a player's information for needed profile page
// and it can be used to get any player's information for different purposes
export const getGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const gameId = vParse(ObjectIdSchema, req.query.id);

    const game = await Game.findOne({ _id: gameId })
      .populate('whitePlayer', 'username')
      .populate('blackPlayer', 'username')
      .exec();

    if (!game) {
      throw new AppError('Game not found');
    }

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

    res.status(200).json({
      message: 'Game found. Success',
      data: {
        game: {
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
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
