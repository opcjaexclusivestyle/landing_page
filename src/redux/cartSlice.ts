import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  productName: string;
  width?: string;
  height?: string;
  amount: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  city?: string;
  postalCode?: string;
  street?: string;
  houseNumber?: string;
}

interface CartState {
  items: CartItem[];
  customerInfo: CustomerInfo | null;
  total: string;
}

const initialState: CartState = {
  items: [],
  customerInfo: null,
  total: '0',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      // Sprawdzenie czy produkt już istnieje w koszyku
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        // Aktualizacja istniejącego produktu
        existingItem.quantity += action.payload.quantity;
      } else {
        // Dodanie nowego produktu
        state.items.push(action.payload);
      }

      // Aktualizacja sumy
      state.total = state.items
        .reduce((sum, item) => sum + parseFloat(item.amount) * item.quantity, 0)
        .toFixed(2);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      // Usunięcie produktu z koszyka
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Aktualizacja sumy
      state.total = state.items
        .reduce((sum, item) => sum + parseFloat(item.amount) * item.quantity, 0)
        .toFixed(2);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      // Znalezienie produktu
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        // Aktualizacja ilości
        item.quantity = action.payload.quantity;

        // Aktualizacja sumy
        state.total = state.items
          .reduce(
            (sum, item) => sum + parseFloat(item.amount) * item.quantity,
            0,
          )
          .toFixed(2);
      }
    },
    setCustomerInfo: (state, action: PayloadAction<CustomerInfo>) => {
      state.customerInfo = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = '0';
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCustomerInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
