import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query so a component can choose the presentation
 * that matches the current viewport. The initial value is resolved
 * synchronously in the browser; this app has no server render.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
