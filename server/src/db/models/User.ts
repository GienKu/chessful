import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'player' | 'admin';
  isVerified: boolean;
  rating: { bullet: number; blitz: number; rapid: number; classical: number };
  totalGames: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  gamesPlayed: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['player', 'admin'],
      default: 'player',
    },
    isVerified: { type: Boolean, default: false },
    rating: {
      type: { bullet: Number, blitz: Number, rapid: Number, classical: Number },
      default: { bullet: 1200, blitz: 1200, rapid: 1200, classical: 1200 },
    },
    totalGames: { type: Number, default: 0 },
    winCount: { type: Number, default: 0 },
    lossCount: { type: Number, default: 0 },
    drawCount: { type: Number, default: 0 },
    gamesPlayed: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);
type UserType = InferSchemaType<typeof UserSchema>;
export type { UserType };
export default mongoose.model<IUser>('User', UserSchema);
