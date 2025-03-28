import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas';
import FriendInvitation from '../../db/models/FriendInvitation';

export const getInvitations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const invitations = await FriendInvitation.find({
      receiver: req.user.id,
    })
      .populate('sender', 'username') // Fetch only the 'username' field of the sender
      .exec();

    const responseData = {
      message: 'Success',
      data: {
        invitations: invitations.map((i) => ({
          id: i.id,
          sender: i.sender,
        })),
      },
    };

    res.status(200).json(responseData);
  } catch (error: any) {
    next(error);
  }
};
