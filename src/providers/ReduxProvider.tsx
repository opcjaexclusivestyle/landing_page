'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { initCart } from '@/store/cartSlice';
import { initCustomer } from '@/store/customerSlice';

// Komponent do inicjalizacji koszyka i danych klienta po stronie klienta
function StoreInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initCart());
    dispatch(initCustomer());
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      {children}
    </Provider>
  );
}
