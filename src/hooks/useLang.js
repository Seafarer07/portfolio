import { useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { LANGS, TEXT } from '../data/translations';

const initialLang = () => {
  try {
    const saved = localStorage.getItem('lang');
    if (LANGS.includes(saved)) return saved;
  } catch { /* storage unavailable */ }
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en';
};

/* Owns the active language: persists it and keeps <html lang> in sync. */
export const useLangState = () => {
  const [lang, setLang] = useState(initialLang);

  useLayoutEffect(() => {
    document.documentElement.lang = TEXT[lang].meta.htmlLang;
    try { localStorage.setItem('lang', lang); } catch { /* storage unavailable */ }
  }, [lang]);

  // Fade the page out, swap the copy while it is invisible, then fade back in
  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('lang-swap');
    setTimeout(() => {
      setLang(l => (l === 'en' ? 'id' : 'en'));
      requestAnimationFrame(() => root.classList.remove('lang-swap'));
    }, 170);
  }, []);
  return useMemo(() => ({ lang, t: TEXT[lang], toggle }), [lang, toggle]);
};
