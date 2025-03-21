// @deno-types="@types/jsonwebtoken"
import { JwtPayload } from 'jsonwebtoken';
import { type UserType } from '../db/models/User';

declare global {
  export interface ApiResponse<T> {
    data?: T;
    message: string;
  }

  export type Role = 'player' | 'admin';

  export interface CustomJwtPayload extends JwtPayload {
    role: Role;
    tokenType: string;
  }

  export namespace Express {
    export interface Request {
      jwtPayload?: CustomJwtPayload;
      parentId: string;
    }

    export interface User extends UserType {}
  }
  interface Player {
    id: string;
    username: string;
    rating: number | null;
    color: 'w' | 'b';
  }

  type Tempo = `${number}+${number}`;
  type GameType = 'classical' | 'blitz' | 'bullet' | 'rapid';
}
