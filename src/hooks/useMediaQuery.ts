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
    // Sprawdzamy czy jesteśmy po stronie klienta (browser)
    if (typeof window === 'undefined') return;

    // Tworzymy MediaQueryList
    const media = window.matchMedia(query);

    // Ustawiamy początkowy stan
    setMatches(media.matches);

    // Funkcja nasłuchująca na zmiany rozmiaru ekranu
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Dodajemy event listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Wsparcie dla starszych przeglądarek
      media.addListener(listener);
    }

    // Cleanup po odmontowaniu komponentu
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // Wsparcie dla starszych przeglądarek
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
