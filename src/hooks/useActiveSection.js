import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/site';

export const useActiveSection = () => {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const observers = NAV_ITEMS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-30% 0px -60% 0px' },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);
  return active;
};
