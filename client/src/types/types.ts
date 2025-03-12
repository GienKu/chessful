export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  rating: { bullet: number; blitz: number; rapid: number; classical: number };
  totalGames: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  friends: string[];
  createdAt: Date;
}
