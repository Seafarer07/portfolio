import { createContext, useContext } from 'react';
import { TEXT } from './data/translations';

export const LangContext = createContext({ lang: 'en', t: TEXT.en, setLang: () => {} });

export const useT = () => useContext(LangContext);
