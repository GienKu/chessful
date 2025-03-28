import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('User not found');
    }

    res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
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
          friends: user.friends.map((friend) => friend.toString()),
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
