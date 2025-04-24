import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import customerReducer from './customerSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
