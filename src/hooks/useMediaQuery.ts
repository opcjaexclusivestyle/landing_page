'use client';

import { useState, useEffect } from 'react';

/**
 * Hook do obsługi media queries pozwalający na responsywne dostosowanie komponentów
 * @param query Media query do sprawdzenia (np. '(max-width: 768px)')
 * @returns Boolean wskazujący czy media query jest spełnione
 */
export function useMediaQuery(query: string): boolean {
  // Stan domyślnie ustawiony na false, aby uniknąć błędów w SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Sprawdź, czy window jest dostępne (SSR check)
    if (typeof window !== 'undefined') {
      // Tworzymy MediaQueryList
      const media = window.matchMedia(query);

      // Ustaw początkową wartość
      setMatches(media.matches);

      // Callback na zmiany
      const listener = () => setMatches(media.matches);

      // Dodaj nasłuchiwanie na zmiany
      media.addEventListener('change', listener);

      // Cleanup
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
}
