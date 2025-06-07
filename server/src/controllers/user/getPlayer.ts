import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas';

// this controller is responsible for getting a player's information for needed profile page
// and it can be used to get any player's information for different purposes
export const getPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = vParse(ObjectIdSchema, req.params.id);

    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      throw new AppError('User not found');
    }

    res.status(200).json({
      message: 'Player information retrieved successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          rating: {
            bullet: user.rating.bullet,
            blitz: user.rating.blitz,
            rapid: user.rating.rapid,
            classical: user.rating.classical,
          },
          totalGames: user.totalGames,
          winCount: user.winCount,
          lossCount: user.lossCount,
          drawCount: user.drawCount,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
