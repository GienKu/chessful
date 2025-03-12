import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types';

export type AuthSliceState = {
  user: User | null;
};

const initialState: AuthSliceState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthSliceState>) => {
      state.user = action.payload.user;
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('PURGE', () => {
      return initialState;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
