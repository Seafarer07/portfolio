import { useState, useLayoutEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* storage unavailable */ }
    return 'dark';
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* storage unavailable */ }
  }, [theme]);

  /* Plain cross-fade between themes. View Transitions snapshots both themes and
     fades them on the compositor, so things CSS cannot interpolate (blend modes,
     filters, gradients) still switch smoothly. Browsers without support get a
     CSS colour fade; reduced-motion users get an instant switch. */
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setTheme(next);
      return;
    }

    if (!document.startViewTransition) {
      root.classList.add('theme-fade');
      setTimeout(() => root.classList.remove('theme-fade'), 500);
      setTheme(next);
      return;
    }

    // Element transitions would still be mid-flight when the new snapshot is
    // taken, so they are switched off for the duration.
    root.classList.add('theme-switching');
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.finished.finally(() => root.classList.remove('theme-switching'));
  }, []);

  return [theme, toggle];
};
