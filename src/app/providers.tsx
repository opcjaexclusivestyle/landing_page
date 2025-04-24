'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

const Providers = ({ children }: { children: React.ReactNode }) => {
  console.warn(
    'Using deprecated providers.tsx. Please update imports to use @/providers/ReduxProvider',
  );
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
