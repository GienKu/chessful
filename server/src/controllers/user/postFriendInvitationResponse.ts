import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError';
import { parse as vParse } from 'valibot';
import User from '../../db/models/User';
import FriendInvitation from '../../db/models/FriendInvitation';
import mongoose from 'mongoose';
import { FriendInvitationResponseSchema } from '../../validation-schemas/validationSchemas';

export const postFriendInvitationResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not attached to request');
    }

    const { id: invitationId, isAccepted } = vParse(
      FriendInvitationResponseSchema,
      req.body
    );

    const invitation = await FriendInvitation.findById(invitationId).exec();

    if (!invitation) {
      throw new AppError('Friend invitation not found');
    }

    invitation.status = isAccepted ? 'accepted' : 'declined';

    if (!(await invitation.save())) {
      throw new AppError(
        'Something went wrong... cannot update friend invitation'
      );
    }

    if (isAccepted) {
      const sender = await User.findOne({
        _id: invitation.sender,
      });

      const receiver = await User.findOne({
        _id: invitation.receiver,
      });

      if (!sender || !receiver) {
        throw new AppError('Something went wrong... cannot find users');
      }

      sender.friends.push(receiver._id as mongoose.Types.ObjectId);
      receiver.friends.push(sender._id as mongoose.Types.ObjectId);

      await sender.save();
      await receiver.save();
    }

    res.status(201).json({ message: 'Success' });
  } catch (error: any) {
    next(error);
  }
};
