import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
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
