'use client';

import { ReactNode, useState, useEffect } from 'react';

interface MediaQueryWrapperProps {
  children: (matches: boolean) => ReactNode;
  query: string;
}

export function MediaQueryWrapper({ children, query }: MediaQueryWrapperProps) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return <>{children(matches)}</>;
}
