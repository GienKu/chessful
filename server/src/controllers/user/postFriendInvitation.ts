import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas';
import FriendInvitation from '../../db/models/FriendInvitation';
import mongoose from 'mongoose';

export const postFriendInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sender = req.user;
    if (!sender) {
      throw new Error('User not attached to request');
    }

    const receiverId = vParse(ObjectIdSchema, req.body.id);
    //check if the user is already friends with the user they are trying to add
    if (sender.friends.map(String).includes(receiverId)) {
      throw new AppError('You are already friends with this user', 400);
    }

    const receiver = await User.findOne({ _id: receiverId }).exec();

    if (!receiver) {
      throw new AppError('User not found', 404);
    }

    //check if there is already a pending friend request
    const invitationExists = await FriendInvitation.findOne({
      sender: sender._id,
      receiver: new mongoose.Types.ObjectId(receiverId),
    }).exec();

    if (invitationExists) {
      throw new AppError('Friend invitation already exists', 400);
    }
    const invitation = new FriendInvitation({
      sender: sender._id,
      receiver: receiverId,
      status: 'pending',
    });

    if (!(await invitation.save())) {
      throw new AppError('Something went wrong... cannot add new friend', 500);
    }

    res.status(201).json({ message: 'Friend invitation sent' });
  } catch (error: any) {
    next(error);
  }
};
