import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas';

//get list of players friends
export const getUserFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const id = vParse(ObjectIdSchema, req.query.id);

    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      throw new AppError('User not found');
    }

    let friends = await User.find({ _id: { $in: user.friends } }).exec();

    const userFriends = await Promise.all(
      friends.map(async (id) => {
        const friend = await User.findOne({ _id: id }).exec();
        console.log('friend', friend);
        if (!friend) return;
        return {
          id: friend.id,
          username: friend.username,
          rating: {
            bullet: friend.rating.bullet,
            blitz: friend.rating.blitz,
            rapid: friend.rating.rapid,
            classical: friend.rating.classical,
          },
          totalGames: friend.totalGames,
          winCount: friend.winCount,
          lossCount: friend.lossCount,
          drawCount: friend.drawCount,
          createdAt: friend.createdAt,
        };
      })
    );

    res.status(200).json({
      message: 'Friends listed',
      data: {
        userFriends,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
