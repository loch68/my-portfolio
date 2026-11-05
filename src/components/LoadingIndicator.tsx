import { useEffect, useState } from 'react';

/**
 * Genuine hero-video readiness indicator.
 *
 * Nothing is shown for the first 500ms, because most visits have the poster
 * and content on screen instantly and a flash of chrome would be noise. If
 * the video is still not ready after that, a thin indeterminate line appears
 * and is removed on `canplay` / `loadeddata` (or after a hard 8s timeout).
 */
export function LoadingIndicator() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('.hero__video');
    if (!video) return;

    if (video.readyState >= 2) return;

    let showTimer = window.setTimeout(() => setVisible(true), 500);
    let hideTimer = 0;

    const hide = () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      setVisible(false);
    };

    video.addEventListener('loadeddata', hide);
    video.addEventListener('canplay', hide);
    video.addEventListener('error', hide);
    hideTimer = window.setTimeout(hide, 8000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      video.removeEventListener('loadeddata', hide);
      video.removeEventListener('canplay', hide);
      video.removeEventListener('error', hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loading-indicator" role="progressbar" aria-label="Loading hero video">
      <span className="loading-indicator__bar" />
    </div>
  );
}
