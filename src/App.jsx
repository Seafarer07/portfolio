import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useActiveSection } from './hooks/useActiveSection';
import { useLangState } from './hooks/useLang';
import { useTheme } from './hooks/useTheme';
import { LangContext } from './i18n';
import { Footer, Header, Loader, SideRails, SkipLink, Spotlight } from './components/Chrome';
import { About, Experience, Hero } from './components/Sections';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import './App.css';

/* The intro loader plays once per browser session; later visits go straight to content. */
const seenIntro = () => {
  try { return sessionStorage.getItem('intro-seen') === '1'; } catch { return false; }
};

const App = () => {
  const active = useActiveSection();
  const [theme, toggleTheme] = useTheme();
  const langState = useLangState();
  const [skipIntro] = useState(seenIntro);
  const [ready, setReady] = useState(skipIntro);
  const [showLoader, setShowLoader] = useState(!skipIntro);

  useEffect(() => {
    if (skipIntro) return;
    const t1 = setTimeout(() => setReady(true), 1600);
    const t2 = setTimeout(() => setShowLoader(false), 2650);
    try { sessionStorage.setItem('intro-seen', '1'); } catch { /* storage unavailable */ }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [skipIntro]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready);
  }, [ready]);

  return (
    <LangContext.Provider value={langState}>
      <SkipLink />
      <Spotlight />
      {showLoader && <Loader hide={ready} />}
      <Header active={active} theme={theme} onToggleTheme={toggleTheme} ready={ready} />
      <SideRails ready={ready} />
      <main id="main" className="main" tabIndex={-1}>
        <Hero ready={ready} />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
      <Analytics />
    </LangContext.Provider>
  );
};

export default App;
