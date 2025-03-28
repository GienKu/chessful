import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../features/redux/hooks';
import {
  clearNotification,
  showNotification,
} from '../features/redux/notificationSlice';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isOpen: boolean;
}

export const useSnackbar = () => {
  const dispatch = useAppDispatch();
  const snackbar = useAppSelector((state) => state.notfication);

  const showSnackbar = (
    message: string,
    severity: SnackbarState['type'] = 'info'
  ) => {
    dispatch(showNotification({ message, severity }));
  };

  const hideSnackbar = () => {
    dispatch(clearNotification());
  };

  return {
    message: snackbar.message,
    isOpen: snackbar.isOpen,
    severity: snackbar.severity,
    showSnackbar,
    hideSnackbar,
  };
};
