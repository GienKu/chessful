import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import {
  GetPlayersQuerySchema,
  ObjectIdSchema,
} from '../../validation-schemas/validationSchemas';
//leter we can add some kind of pagination to this query
//this controller is responsible for getting a list of players based on the query
export const getPlayersQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const { username } = vParse(GetPlayersQuerySchema, req.query);

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: req.user.id },
    }).exec();

    const usersData = users.map((user) => ({
      id: user.id,
      username: user.username,
    }));

    res.status(200).json({
      message: 'Success',
      data: {
        users: usersData,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
