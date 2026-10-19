import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, Instagram, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight, Sun, Moon, Menu, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import reusemartImg from './assets/images/reusemart.png';
import Baratie1    from './assets/images/Baratie1.png';
import Baratie2    from './assets/images/Baratie2.png';
import Baratie3    from './assets/images/Baratie3.png';
import Eco1        from './assets/images/Eco1.png';
import Eco2        from './assets/images/Eco2.png';
import Eco3        from './assets/images/Eco3.png';
import J1          from './assets/images/J1.png';
import J2          from './assets/images/J2.png';
import TA1         from './assets/images/TA1.png';
import TA2         from './assets/images/TA2.png';
import TA3         from './assets/images/TA3.png';
import './App.css';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const NAV_ITEMS = ['about', 'experience', 'projects', 'contact'];

const EMAIL = 'wicaksonoadinatanael@gmail.com';

const SOCIALS = [
  { label: 'GitHub',    href: 'https://github.com/Seafarer07',                          Icon: Github },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/natanaeladiwicaksono/',      Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/natanaelaw_/',                 Icon: Instagram },
];

const SKILLS = [
  { label: 'Frameworks & Libraries', items: 'Laravel 11, Livewire, Alpine.js, React.js, Vite, Tailwind CSS' },
  { label: 'Languages',              items: 'PHP, JavaScript, Python, Java, C, SQL, HTML, CSS' },
  { label: 'Tools & Design',         items: 'Git, GitHub, Figma, Canva' },
  { label: 'Database & Integrations',items: 'MySQL, Laravel Sanctum, REST APIs, OAuth 2.0 Microsoft, IMAP / SSO' },
];

const EXPERIENCES = [
  {
    company: 'Eclectic Consulting',
    tab:     'Management Trainee',
    role:    'Management Trainee',
    period:  'Apr 2026 – Present',
    desc:    'Promoted directly from internship. Currently rebuilding the platform\'s authorization layer into a centralized RBAC system covering 64 roles and 90 features across multiple client organizations.',
  },
  {
    company: 'Eclectic Consulting',
    tab:     'Intern Web Developer',
    role:    'Intern Web Developer',
    period:  'Oct 2025 – Apr 2026',
    desc:    'Shipped two production apps from scratch, Ecosystem (ERP) and Jarvies (customer portal), using Laravel 11, Livewire, Alpine.js, and MySQL. Built a 7-stage helpdesk with threaded chat and multi-level approval, implemented cross-portal SSO with Microsoft OAuth 2.0, and owned deployment end-to-end.',
  },
  {
    company: 'UAJY',
    tab:     'Asst. Lecturer (Entre.)',
    role:    'Asst. Lecturer, Entrepreneurship',
    period:  'Jan 2025 – Jun 2025',
    desc:    'Guided student teams building real solutions for 40 UMKM partners across Yogyakarta. Ran weekly progress reviews and organized a final public showcase with live business presentations.',
  },
  {
    company: 'UAJY',
    tab:     'Asst. Lecturer (AI)',
    role:    'Asst. Lecturer, Intro to AI',
    period:  'Jul 2024 – Dec 2024',
    desc:    'Co-led a 200-student AI course covering Python, CNNs, and image classification. Authored all course materials: lecture notes, exercises, challenge sets, and assessments.',
  },
];

const PROJECTS = [
  {
    title:       'Ecosystem',
    description: 'Internal enterprise resource planning platform built at Eclectic Consulting. Covers multi-org user management, a 7-stage helpdesk ticketing system with threaded chat and mandays negotiation, role-based access control, and Microsoft OAuth 2.0 integration. Live in production.',
    tech:        ['Laravel 11', 'Livewire', 'Alpine.js', 'MySQL', 'Tailwind CSS', 'Laravel Sanctum'],
    github:      null,
    demo:        "https://me.eclectic.co.id/",
    images:      [Eco1, Eco2, Eco3],
  },

  {
    title:       'Jarvies',
    description: 'Customer-facing portal paired with Ecosystem, built for Eclectic Consulting clients. Features cross-portal single sign-on via a custom auth provider, seamless session handoff, and a clean interface tailored for end users. Live in production.',
    tech:        ['Laravel 11', 'Livewire', 'Alpine.js', 'MySQL', 'Tailwind CSS', 'Laravel Sanctum'],
    github:      null,
    demo:        "https://help.eclectic.co.id/",
    images:      [J1, J2],
  },
  {
    title:       'Tennis Artist Academy',
    description: 'Production website for Tennis Artist Academy featuring course catalog, registration flow, and integrated checkout. Built with a clean, mobile-first design focused on conversion and ease of use.',
    tech:        ['React.js', 'Vite', 'Tailwind CSS'],
    github:      null,
    demo:        "https://tennisartistacademy.com/",
    images:      [TA1,TA2,TA3],
  },
  {
    title:       'Baratie Restaurant',
    description: 'A full-stack restaurant management system built to handle real daily operations. Covers real-time inventory tracking, integrated payment processing, and a centralized admin dashboard for managing orders, menus, and staff.',
    tech:        ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github:      "https://github.com/Seafarer07/BaratieResto",
    demo:        null,
    images:      [Baratie1, Baratie2, Baratie3],
  },
  {
    title:       'Reuse Mart',
    description: 'A second-hand goods marketplace with a complete buyer and seller experience. Features advanced search with filters, a seller management dashboard, and a clean checkout flow built to handle real transactional traffic without friction.',
    tech:        ['Laravel', 'Tailwind CSS', 'MySQL'],
    github:      "https://github.com/Seafarer07/ReuseMart",
    demo:        null,
    images:      [reusemartImg],
  },
];

/* ─── Hooks ───────────────────────────────────────────────────────────────── */

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
};


const useMouseSpotlight = () => {
  useEffect(() => {
    let raf;
    const move = ({ clientX, clientY }) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${clientX}px`);
        document.documentElement.style.setProperty('--my', `${clientY}px`);
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
};

const useActiveSection = () => {
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

/* ─── Theme + scroll hooks ────────────────────────────────────────────────── */

const useTheme = () => {
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

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);
  return [theme, toggle];
};

const useScrollState = () => {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setState(prev => {
        const scrolled = y > 50;
        const hidden = scrolled && y > last && y > 150;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return state;
};

/* ─── Logo + Loader ───────────────────────────────────────────────────────── */

const HEX_POINTS = '50,4 90,27 90,73 50,96 10,73 10,27';

const Logo = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <polygon className="logo__hex" points={HEX_POINTS} />
    <text className="logo__letter" x="50" y="65" textAnchor="middle">N</text>
  </svg>
);

const Loader = ({ hide }) => (
  <div className={`loader${hide ? ' loader--hide' : ''}`} role="status" aria-label="Loading">
    <div className="loader__logo" />
    <p className="loader__name">Natanael Adi Wicaksono</p>
    <span className="loader__bar" />
  </div>
);

/* ─── Header ──────────────────────────────────────────────────────────────── */

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    className="theme-toggle"
    onClick={onToggle}
    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
  >
    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
  </button>
);

const Header = ({ active, theme, onToggleTheme, ready }) => {
  const { scrolled, hidden } = useScrollState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    return () => document.documentElement.classList.remove('menu-open');
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`header${ready ? ' header--in' : ''}${scrolled ? ' header--scrolled' : ''}${hidden && !open ? ' header--hidden' : ''}`}
      >
        <a href="#top" className="header__logo" aria-label="Home" onClick={close}>
          <span className="header__logo-svg" aria-hidden="true" />
        </a>

        <div className="header__right">
          <nav className="header__nav" aria-label="Page sections">
            {NAV_ITEMS.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={`header__link${active === id ? ' header__link--active' : ''}`}
              >
                <span className="header__num">0{i + 1}.</span>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="header__burger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <aside className={`mobile-nav${open ? ' mobile-nav--open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile page sections">
          {NAV_ITEMS.map((id, i) => (
            <a key={id} href={`#${id}`} className="mobile-nav__link" onClick={close} tabIndex={open ? 0 : -1}>
              <span>0{i + 1}.</span>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
      </aside>
      <div className={`mobile-backdrop${open ? ' mobile-backdrop--open' : ''}`} onClick={close} />
    </>
  );
};

/* ─── Fixed side rails (socials left, email right) ────────────────────────── */

const SideRails = ({ ready }) => (
  <>
    <div className={`side side--left${ready ? ' side--in' : ''}`}>
      <ul>
        {SOCIALS.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon size={20} />
            </a>
          </li>
        ))}
      </ul>
    </div>
    <div className={`side side--right${ready ? ' side--in' : ''}`}>
      <a href={`mailto:${EMAIL}`} className="side__email">{EMAIL}</a>
    </div>
  </>
);

/* ─── Section heading ─────────────────────────────────────────────────────── */

const SectionHeading = ({ num, children }) => (
  <h2 className="section-heading">
    <span>{num}.</span>
    {children}
  </h2>
);

/* ─── Hero ────────────────────────────────────────────────────────────────── */


const CODE_LINES = [
  <><span className="tok-k">const</span> <span className="tok-v">natanael</span> <span className="tok-p">= {'{'}</span></>,
  <>  <span className="tok-key">role</span><span className="tok-p">:</span> <span className="tok-s">"Full Stack Developer"</span><span className="tok-p">,</span></>,
  <>  <span className="tok-key">stack</span><span className="tok-p">: [</span><span className="tok-s">"Laravel"</span><span className="tok-p">,</span> <span className="tok-s">"Livewire"</span><span className="tok-p">,</span> <span className="tok-s">"React"</span><span className="tok-p">],</span></>,
  <>  <span className="tok-key">currently</span><span className="tok-p">:</span> <span className="tok-s">"Eclectic Consulting"</span><span className="tok-p">,</span></>,
  <>  <span className="tok-key">shipped</span><span className="tok-p">:</span> <span className="tok-n">2</span><span className="tok-p">,</span> <span className="tok-c">// to production</span></>,
  <>  <span className="tok-key">openToWork</span><span className="tok-p">:</span> <span className="tok-n">true</span><span className="tok-p">,</span></>,
  <><span className="tok-p">{'}'};</span></>,
];

const Hero = ({ ready }) => (
  <section id="top" className={`hero${ready ? ' hero--in' : ''}`}>
    <div className="hero__text">
      <p className="hero__item hero__eyebrow" style={{ '--i': 0 }}>Natanael Adi Wicaksono</p>
      <h1 className="hero__item hero__title" style={{ '--i': 1 }}>
        Building web apps <em>businesses</em> can rely on.
      </h1>
      <p className="hero__item hero__desc" style={{ '--i': 2 }}>
        I'm a full stack developer who takes products from the first line of code to production.
        Currently a Management Trainee at{' '}
        <a href="https://eclectic.co.id" target="_blank" rel="noopener noreferrer" className="inline-link">
          Eclectic Consulting
        </a>, where I build and run internal platforms used every day.
      </p>
      <div className="hero__item hero__cta" style={{ '--i': 3 }}>
        <a href="#projects" className="btn btn--solid">View My Work</a>
        <a href="#contact" className="btn">Get In Touch</a>
      </div>
    </div>

    <div className="hero__item hero__card" style={{ '--i': 3 }} aria-hidden="true">
      <div className="hero__card-bar">
        <i /><i /><i />
        <span>developer.js</span>
      </div>
      <pre className="hero__code">
        {CODE_LINES.map((line, i) => (
          <code key={i} className="hero__line" style={{ '--l': i }}>{line}</code>
        ))}
      </pre>
      <div className="hero__card-foot">
        <span className="avail-dot" />
        Open to opportunities
      </div>
    </div>
  </section>
);

/* ─── About ───────────────────────────────────────────────────────────────── */

const About = () => {
  const [bodyRef,   bodyInView]   = useInView(0.1);
  const [skillsRef, skillsInView] = useInView(0.1);

  return (
    <section id="about" className="content-section content-section--narrow">
      <SectionHeading num="01">About Me</SectionHeading>

      <div ref={bodyRef} className={`about-body reveal${bodyInView ? ' in' : ''}`}>
        <p>
          Final-year Informatics student at{' '}
          <a href="https://www.uajy.ac.id" target="_blank" rel="noopener noreferrer" className="inline-link">
            Universitas Atma Jaya Yogyakarta
          </a>{' '}
          shipping production code since sophomore year. I build software clean and reliable enough
          that businesses run it daily.
        </p>
        <p>
          At Eclectic Consulting I'm rebuilding enterprise authorization for multi-org platforms. I also
          spent two semesters as an Assistant Lecturer, and teaching 200+ students sharpened how I think
          and communicate.
        </p>
      </div>

      <ul ref={skillsRef} className={`skills-list reveal${skillsInView ? ' in' : ''}`}
        style={{ transitionDelay: '0.1s' }}>
        {SKILLS.map(s => (
          <li key={s.label}>
            <span className="skills-list__label">{s.label}: </span>
            {s.items}
          </li>
        ))}
      </ul>
    </section>
  );
};

/* ─── Experience ──────────────────────────────────────────────────────────── */

const Experience = () => {
  const [active, setActive]     = useState(0);
  const [panelRef, panelInView] = useInView(0.1);
  const exp = EXPERIENCES[active];

  return (
    <section id="experience" className="content-section content-section--narrow">
      <SectionHeading num="02">Where I've Worked</SectionHeading>
      <div className="exp-wrap">
        <div className="exp-tabs" role="tablist">
          {EXPERIENCES.map((e, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              className={`exp-tab${i === active ? ' exp-tab--active' : ''}`}
              onClick={() => setActive(i)}
            >
              {e.tab}
            </button>
          ))}
        </div>

        <div
          ref={panelRef}
          className={`exp-panel reveal${panelInView ? ' in' : ''}`}
          role="tabpanel"
        >
          <h3 className="exp-title">
            {exp.role}
            <span className="exp-company"> @ {exp.company}</span>
          </h3>
          <p className="exp-period">{exp.period}</p>
          <p className="exp-desc">{exp.desc}</p>
        </div>
      </div>

      <a
        href="https://www.linkedin.com/in/natanaeladiwicaksono/"
        target="_blank"
        rel="noopener noreferrer"
        className="view-more-link"
      >
        View Full Profile on LinkedIn <ArrowUpRight size={15} />
      </a>
    </section>
  );
};

/* ─── Projects ────────────────────────────────────────────────────────────── */

const ProjCard = ({ p, reverse }) => {
  const [ref, inView] = useInView(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [dir, setDir] = useState('next');
  const hasImages = p.images && p.images.length > 0;
  const multi     = hasImages && p.images.length > 1;

  const prev = useCallback(e => {
    e.stopPropagation();
    setDir('prev');
    setImgIdx(i => (i - 1 + p.images.length) % p.images.length);
  }, [p.images]);

  const next = useCallback(e => {
    e.stopPropagation();
    setDir('next');
    setImgIdx(i => (i + 1) % p.images.length);
  }, [p.images]);

  const goTo = useCallback((target) => {
    setDir(target > imgIdx ? 'next' : 'prev');
    setImgIdx(target);
  }, [imgIdx]);

  return (
    <article
      ref={ref}
      className={`proj-card reveal${inView ? ' in' : ''}${hasImages ? '' : ' proj-card--solo'}${reverse ? ' proj-card--rev' : ''}`}
    >
      {hasImages && (
        <div className="proj-img">
          <img key={imgIdx} src={p.images[imgIdx]} alt={`${p.title} preview ${imgIdx + 1}`} loading="lazy" className={`proj-slide--${dir}`} />
          {multi && (
            <>
              <button className="proj-img__arrow proj-img__arrow--prev" onClick={prev} aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button className="proj-img__arrow proj-img__arrow--next" onClick={next} aria-label="Next image">
                <ChevronRight size={18} />
              </button>
              <div className="proj-img__dots">
                {p.images.map((_, i) => (
                  <span
                    key={i}
                    className={`proj-img__dot${i === imgIdx ? ' proj-img__dot--active' : ''}`}
                    onClick={e => { e.stopPropagation(); goTo(i); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="proj-content">
        <p className="proj-eyebrow">Featured Project</p>
        <h3 className="proj-name">{p.title}</h3>
        <p className="proj-desc">{p.description}</p>
        <ul className="proj-tech">
          {p.tech.map(t => <li key={t}>{t}</li>)}
        </ul>
        <div className="proj-links">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={20} />
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const Projects = () => (
  <section id="projects" className="content-section">
    <SectionHeading num="03">Some Things I've Built</SectionHeading>
    <div className="proj-list">
      {PROJECTS.map((p, i) => (
        <ProjCard key={p.title} p={p} reverse={i % 2 === 1} />
      ))}
    </div>
  </section>
);

/* ─── Contact ─────────────────────────────────────────────────────────────── */

const Contact = () => {
  const [formRef, formInView] = useInView(0.1);
  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [status,  setStatus]  = useState(null);

  const set = useCallback(
    field => e => setForm(f => ({ ...f, [field]: e.target.value })),
    [],
  );

  useEffect(() => {
    if (status !== 'ok' && status !== 'err') return;
    const t = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(t);
  }, [status]);

  const submit = useCallback(async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        'service_zle8ngk',
        'template_d74ysi6',
        {
          from_name:  form.name,
          from_email: form.email,
          email:      form.email,
          message:    form.message,
          to_email:   'wicaksonoadinatanael@gmail.com',
        },
        'BNWabFnbZuieyyy6R',
      );
      setStatus('ok');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('err');
    }
  }, [form]);

  const sending = status === 'sending';

  return (
    <section id="contact" className="content-section content-section--contact">
      <p className="contact-eyebrow">04. What's Next?</p>
      <h2 className="contact-title">Get In Touch</h2>
      <p className="contact-intro">
        Have a project that needs a dedicated developer? Looking for someone who ships clean,
        maintainable code and takes quality seriously? I am currently open to new opportunities
        and would love to hear what you are building. Send a message and I will get back to you.
      </p>

      {status === 'ok' && (
        <p className="status-msg status-ok">Message sent. I'll get back to you soon.</p>
      )}
      {status === 'err' && (
        <p className="status-msg status-err">
          Failed to send. Please email me at{' '}
          <a href="mailto:wicaksonoadinatanael@gmail.com" className="inline-link">
            wicaksonoadinatanael@gmail.com
          </a>
        </p>
      )}

      <form
        ref={formRef}
        className={`contact-form reveal${formInView ? ' in' : ''}`}
        onSubmit={submit}
        noValidate
      >
        <div className="form-row">
          <label className="form-field">
            <span>Name</span>
            <input
              type="text" required
              value={form.name} onChange={set('name')}
              disabled={sending} placeholder="Your name"
            />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email" required
              value={form.email} onChange={set('email')}
              disabled={sending} placeholder="your@email.com"
            />
          </label>
        </div>
        <label className="form-field">
          <span>Message</span>
          <textarea
            required rows={5}
            value={form.message} onChange={set('message')}
            disabled={sending} placeholder="Your message"
          />
        </label>
        <button type="submit" className="btn contact-btn" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

/* ─── Footer ──────────────────────────────────────────────────────────────── */

const Footer = () => (
  <footer className="footer">
    <div className="footer__socials">
      {SOCIALS.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon size={20} />
        </a>
      ))}
      <a href={`mailto:${EMAIL}`} aria-label="Email"><Mail size={20} /></a>
    </div>
    <p>Designed &amp; built by Natanael Adi Wicaksono</p>
    <p>
      Inspired by{' '}
      <a href="https://brittanychiang.com/" target="_blank" rel="noopener noreferrer" className="inline-link">
        brittanychiang.com
      </a>
    </p>
  </footer>
);

/* ─── App ─────────────────────────────────────────────────────────────────── */

const App = () => {
  useMouseSpotlight();
  const active = useActiveSection();
  const [theme, toggleTheme] = useTheme();
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 2000);
    const t2 = setTimeout(() => setShowLoader(false), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready);
  }, [ready]);

  return (
    <>
      {showLoader && <Loader hide={ready} />}
      <Header active={active} theme={theme} onToggleTheme={toggleTheme} ready={ready} />
      <SideRails ready={ready} />
      <main className="main">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

export default App;
