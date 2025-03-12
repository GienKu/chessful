export interface ApiResponse {
  message: string;
  data?: any;
}

export interface ApiErrorResponse {
  messages: string[];
  details: any;
}

export interface UserLoginResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      isVerified: boolean;
      rating: {
        bullet: number;
        blitz: number;
        rapid: number;
        classical: number;
      };
      totalGames: number;
      winCount: number;
      lossCount: number;
      drawCount: number;
      friends: string[];
      createdAt: Date;
    };
  };
}
