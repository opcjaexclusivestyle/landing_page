import { useDispatch as useReduxDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';

// Użyj tego zamiast prostego useDispatch
export const useAppDispatch: () => AppDispatch = useReduxDispatch;
