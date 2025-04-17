import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    id?: string;
    email?: string;
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: false,
};

// Definiujemy akcje poza slice'm dla większej kontroli nad typowaniem
export const setLoadingAction = createAction<boolean>('auth/setLoading');
export const loginSuccessAction = createAction<{
  id: string;
  email: string;
  isAdmin: boolean;
}>('auth/loginSuccess');
export const logoutAction = createAction('auth/logout');

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setLoadingAction, (state, action) => {
        state.loading = action.payload;
      })
      .addCase(loginSuccessAction, (state, action) => {
        state.isAuthenticated = true;
        state.isAdmin = action.payload.isAdmin;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
        };
        state.loading = false;
      })
      .addCase(logoutAction, (state) => {
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.user = null;
        state.loading = false;
      });
  },
});

// Eksportujemy akcje z przeznaczonymi do używania aliasami
export const setLoading = setLoadingAction;
export const loginSuccess = loginSuccessAction;
export const logout = logoutAction;

export default authSlice.reducer;
