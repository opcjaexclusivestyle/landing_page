import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  street?: string;
  houseNumber?: string;
}

interface CustomerState {
  info: CustomerInfo | null;
}

// Próba wczytania danych klienta z localStorage - tylko po stronie klienta
const loadCustomerFromStorage = (): CustomerState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCustomer = localStorage.getItem('customer');
      if (savedCustomer) {
        return JSON.parse(savedCustomer);
      }
    } catch (e) {
      console.error(
        'Błąd podczas wczytywania danych klienta z localStorage:',
        e,
      );
    }
  }
  return { info: null };
};

// Początkowy stan bezpieczny dla SSR
const initialState: CustomerState = { info: null };

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    initCustomer: (state) => {
      if (typeof window !== 'undefined') {
        const storedCustomer = loadCustomerFromStorage();
        state.info = storedCustomer.info;
      }
    },
    setCustomerInfo: (state, action: PayloadAction<CustomerInfo>) => {
      state.info = action.payload;

      // Zapisz dane klienta w localStorage po stronie klienta
      if (typeof window !== 'undefined') {
        localStorage.setItem('customer', JSON.stringify(state));
      }
    },
    clearCustomerInfo: (state) => {
      state.info = null;

      // Wyczyść dane klienta w localStorage po stronie klienta
      if (typeof window !== 'undefined') {
        localStorage.removeItem('customer');
      }
    },
  },
});

export const { initCustomer, setCustomerInfo, clearCustomerInfo } =
  customerSlice.actions;
export default customerSlice.reducer;
