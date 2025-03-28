import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameType } from '../../types/types';

export interface Game {
  gameId: string;
  tempo: string;
  ranked: boolean;
  type: string;
  owner: {
    id: string;
    username: string;
    rating: number | null;
    color: boolean;
  };
  opponent: {
    id: string;
    username: string;
    rating: number | null;
    color: boolean;
  };
}

interface SocketEventsState {
  playerGames: Game[];
  gamesList: Game[];
}

const initialState: SocketEventsState = {
  gamesList: [] as Game[],
  playerGames: [] as Game[],
};

const socketEventsDataSlice = createSlice({
  name: 'socketEventsData',
  initialState,
  reducers: {
    setGamesList(state, action: PayloadAction<Game[]>) {
      state.gamesList = action.payload;
    },
    clearGamesList(state) {
      state.gamesList = [];
    },
    setPlayerGames(state, action: PayloadAction<Game[]>) {
      state.playerGames = action.payload;
    },
    clearPlayerGames(state) {
      state.playerGames = [];
    },
  },
});

export const {
  setGamesList,
  clearGamesList,
  setPlayerGames,
  clearPlayerGames,
} = socketEventsDataSlice.actions;

export default socketEventsDataSlice.reducer;
