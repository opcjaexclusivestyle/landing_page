import { setLoading, loginSuccess, logout } from './authSlice';
import { AppDispatch } from './store';

// Funkcje wrapujące akcje Redux
export const setAuthLoading =
  (isLoading: boolean) => (dispatch: AppDispatch) => {
    dispatch(setLoading(isLoading));
  };

export const loginUser =
  (userData: { id: string; email: string; isAdmin: boolean }) =>
  (dispatch: AppDispatch) => {
    dispatch(loginSuccess(userData));
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(logout());
};
