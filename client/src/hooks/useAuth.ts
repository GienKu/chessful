import { useAppDispatch, useAppSelector } from '../features/redux/hooks';
import {
  AuthSliceState,
  setUser,
  clearUser,
} from '../features/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './useSocket';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { socket, socketRefresh } = useSocket();

  const userLogin = (payload: AuthSliceState) => {
    socketRefresh();
    dispatch(setUser(payload));
  };

  const userLogout = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    switch (res.status) {
      case 401:
        navigate('/unauthorized');
        break;
      case 403:
        navigate('/forbidden');
        break;
      case 200:
        dispatch(clearUser());
        socketRefresh();
        break;
      default:
        console.error('User logout failed');
    }
  };

  const getUserData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(setUser(data.data));
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('An error occurred while fetching user data:', error);
    }
  };

  return { authState, userLogin, userLogout, getUserData };
};
