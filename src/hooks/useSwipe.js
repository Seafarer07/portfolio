import { useRef } from 'react';

/* Horizontal swipe detection for touch. Vertical scrolling is left alone. */
export const useSwipe = (onLeft, onRight, threshold = 40) => {
  const start = useRef(null);

  return {
    onTouchStart: e => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: e => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onLeft(); else onRight();
    },
  };
};
