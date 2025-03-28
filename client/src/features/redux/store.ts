import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import socketDataReducer from './socketDataSlice';
import notiReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socketData: socketDataReducer,
    notfication: notiReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
