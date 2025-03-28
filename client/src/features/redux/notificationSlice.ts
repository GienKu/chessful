import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  message: string | null;
  severity: 'success' | 'error' | 'info' | 'warning' | null;
  isOpen: boolean;
}

const initialState: NotificationState = {
  message: null,
  severity: null,
  isOpen: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.isOpen = true;
    },
    clearNotification: (state) => {
      state.message = null;
      state.severity = null;
      state.isOpen = false;
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
