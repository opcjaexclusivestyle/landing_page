import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: Address;
}

interface CustomerState {
  info: CustomerInfo | null;
}

const initialState: CustomerState = {
  info: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerInfo: (state, action: PayloadAction<CustomerInfo>) => {
      state.info = action.payload;
    },
    clearCustomerInfo: (state) => {
      state.info = null;
    },
  },
});

export const { setCustomerInfo, clearCustomerInfo } = customerSlice.actions;
export default customerSlice.reducer;
