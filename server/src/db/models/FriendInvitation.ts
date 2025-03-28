import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

export interface IFriendInvitation extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

const FriendInvitationSchema = new Schema<IFriendInvitation>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

type FriendInvitationType = InferSchemaType<typeof FriendInvitationSchema>;
export type { FriendInvitationType };
export default mongoose.model<IFriendInvitation>(
  'FriendInvitation',
  FriendInvitationSchema
);
