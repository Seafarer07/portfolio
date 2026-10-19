import { memo, useEffect, useRef, useState } from 'react';
import { Sun, Moon, Menu, X, Mail } from 'lucide-react';
import { EMAIL, NAV_ITEMS, SOCIALS } from '../data/site';
import { useInView } from '../hooks/useInView';
import { useScrollState } from '../hooks/useScrollState';
import { useT } from '../i18n';

/* Page chrome: skip link, loader, spotlight, header, side rails, footer. */

export const SkipLink = () => {
  const { t } = useT();
  return <a href="#main" className="skip-link">{t.ui.skip}</a>;
};

/* Moves a fixed gradient element with transform only, so the cursor never
   triggers style recalculation or repaint of the page. */
export const Spotlight = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const half = el.offsetWidth / 2;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
    };
    const move = e => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="spotlight" aria-hidden="true" />;
};

export const Loader = ({ hide }) => {
  const { t } = useT();
  return (
    <div className={`loader${hide ? ' loader--hide' : ''}`} role="status" aria-label={t.ui.loading}>
      <div className="loader__logo" />
      <p className="loader__name">Natanael Adi Wicaksono</p>
      <span className="loader__bar" />
    </div>
  );
};

const ThemeToggle = ({ theme, onToggle }) => {
  const { t } = useT();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={dark ? t.ui.toLight : t.ui.toDark}
      title={dark ? t.ui.lightTitle : t.ui.darkTitle}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

const LangToggle = () => {
  const { t, toggle } = useT();
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={t.ui.switchLang}
      title={t.ui.switchLang}
      lang={t.ui.langShort === 'ID' ? 'id' : 'en'}
    >
      {t.ui.langShort}
    </button>
  );
};

export const Header = ({ active, theme, onToggleTheme, ready }) => {
  const { t } = useT();
  const { scrolled, hidden } = useScrollState();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    return () => document.documentElement.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const label = id => t.nav[id];

  return (
    <>
      <header
        className={`header${ready ? ' header--in' : ''}${scrolled ? ' header--scrolled' : ''}${hidden && !open ? ' header--hidden' : ''}`}
      >
        <a href="#top" className="header__logo" aria-label={t.ui.home} onClick={close}>
          <span className="header__logo-svg" aria-hidden="true" />
        </a>

        <div className="header__right">
          <nav className="header__nav" aria-label={t.ui.sections}>
            {NAV_ITEMS.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={`header__link${active === id ? ' header__link--active' : ''}`}
                aria-current={active === id ? 'true' : undefined}
              >
                <span className="header__num" aria-hidden="true">0{i + 1}.</span>
                {label(id)}
              </a>
            ))}
          </nav>
          <LangToggle />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            ref={burgerRef}
            type="button"
            className="header__burger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? t.ui.closeMenu : t.ui.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <aside id="mobile-nav" className={`mobile-nav${open ? ' mobile-nav--open' : ''}`} inert={!open}>
        <nav aria-label={t.ui.mobileSections}>
          {NAV_ITEMS.map((id, i) => (
            <a key={id} href={`#${id}`} className="mobile-nav__link" style={{ '--i': i }} onClick={close}>
              <span aria-hidden="true">0{i + 1}.</span>
              {label(id)}
            </a>
          ))}
        </nav>
      </aside>
      <div className={`mobile-backdrop${open ? ' mobile-backdrop--open' : ''}`} onClick={close} aria-hidden="true" />
    </>
  );
};

/* Fixed side rail: socials on the left. */
export const SideRails = memo(({ ready }) => {
  const { t } = useT();
  return (
    <>
      <div className={`side side--left${ready ? ' side--in' : ''}`}>
        <ul>
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (${t.ui.newTab})`}>
                <Icon size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
});

export const SectionHeading = ({ num, id, children }) => {
  const [ref, inView] = useInView(0.6);
  return (
    <h2 ref={ref} id={id} className={`section-heading reveal${inView ? ' in' : ''}`}>
      <span aria-hidden="true">{num}.</span>
      {children}
    </h2>
  );
};

export const Footer = memo(() => {
  const { t } = useT();
  return (
    <footer className="footer">
      <div className="footer__socials">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (${t.ui.newTab})`}>
            <Icon size={20} aria-hidden="true" />
          </a>
        ))}
        <a href={`mailto:${EMAIL}`} aria-label={t.footer.email}><Mail size={20} aria-hidden="true" /></a>
      </div>
      <p>{t.footer.built}</p>
      <p>
        {t.footer.inspired}
        <a href="https://brittanychiang.com/" target="_blank" rel="noopener noreferrer" className="inline-link">
          brittanychiang.com
        </a>
      </p>
    </footer>
  );
});
