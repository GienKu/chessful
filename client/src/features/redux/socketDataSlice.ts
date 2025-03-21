import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameType } from '../../types/types';



export interface Games {
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
}

interface SocketEventsState {

  gamesList: Games[];
}

const initialState: SocketEventsState = {

  gamesList: [] as Games[],
};

const socketEventsDataSlice = createSlice({
  name: 'socketEventsData',
  initialState,
  reducers: {

    setGamesList(state, action: PayloadAction<Games[]>) {
      state.gamesList = action.payload;
    },
    clearGamesList(state) {
      state.gamesList = [];
    },
  },
});

export const {  setGamesList, clearGamesList } =
  socketEventsDataSlice.actions;

export default socketEventsDataSlice.reducer;
