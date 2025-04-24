import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Typy dla opcji produktów
export type PurchaseType = 'bedding-with-sheet' | 'bedding-only' | 'sheet-only';
export type ColorOption = string;

interface ExtendedCartItemOptions {
  width: string;
  height: string;
  embroidery: boolean;
  curtainRod: boolean;
  purchaseType?: PurchaseType;
  color?: ColorOption;
  customSize?: string | null;
  comment?: string | null;
  variant?: number;
  additionalOptions?: Record<string, string>;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: ExtendedCartItemOptions;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

// Próba wczytania koszyka z localStorage - tylko po stronie klienta
const loadCartFromStorage = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Błąd podczas wczytywania koszyka z localStorage:', e);
    }
  }
  return { items: [], total: 0 };
};

// Pobierz początkowy stan - bezpieczny dla SSR
const initialState: CartState = { items: [], total: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart: (state) => {
      if (typeof window !== 'undefined') {
        const storedCart = loadCartFromStorage();
        state.items = storedCart.items;
        state.total = storedCart.total;
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Sprawdź, czy produkt już istnieje w koszyku
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (existingItemIndex >= 0) {
        // Aktualizuj istniejący produkt
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Dodaj nowy produkt
        state.items.push(action.payload);
      }

      // Przelicz sumę
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Zapisz koszyk w localStorage po stronie klienta
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Przelicz sumę
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Zapisz koszyk w localStorage po stronie klienta
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;

        // Przelicz sumę
        state.total = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );

        // Zapisz koszyk w localStorage po stronie klienta
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state));
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;

      // Wyczyść koszyk w localStorage po stronie klienta
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
      }
    },
  },
});

export const {
  initCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
