import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, Instagram, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import baratieImg   from './assets/images/baratie.png';
import reusemartImg from './assets/images/reusemart.png';
import './App.css';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const NAV_ITEMS = ['about', 'experience', 'projects', 'contact'];

const SKILLS = [
  { label: 'Frameworks & Libraries', items: 'Laravel 11, Livewire, Alpine.js, React.js, Vite, Tailwind CSS' },
  { label: 'Languages',              items: 'PHP, JavaScript, Python, Java, C, SQL, HTML, CSS' },
  { label: 'Tools & Design',         items: 'Git, GitHub, Figma, Canva' },
  { label: 'Database & Integrations',items: 'MySQL, Laravel Sanctum, REST APIs, OAuth 2.0 Microsoft, IMAP / SSO' },
];

const EXPERIENCES = [
  {
    company: 'Eclectic Consulting',
    role:    'Management Trainee',
    period:  'Apr 2026 – Present',
    desc:    'Promoted directly from internship. Currently rebuilding the platform\'s authorization layer into a centralized RBAC system covering 64 roles and 90 features across multiple client organizations.',
  },
  {
    company: 'Eclectic Consulting',
    role:    'Intern Web Developer',
    period:  'Oct 2025 – Apr 2026',
    desc:    'Shipped two production apps from scratch, Ecosystem (ERP) and Jarvies (customer portal), using Laravel 11, Livewire, Alpine.js, and MySQL. Built a 7-stage helpdesk with threaded chat and multi-level approval, implemented cross-portal SSO with Microsoft OAuth 2.0, and owned deployment end-to-end.',
  },
  {
    company: 'UAJY',
    role:    'Asst. Lecturer, Entrepreneurship',
    period:  'Jan 2025 – Jun 2025',
    desc:    'Guided student teams building real solutions for 40 UMKM partners across Yogyakarta. Ran weekly progress reviews and organized a final public showcase with live business presentations.',
  },
  {
    company: 'UAJY',
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
    demo:        "https://eclectic.co.id/",
    images:      [],
  },

  {
    title:       'Jarvies',
    description: 'Customer-facing portal paired with Ecosystem, built for Eclectic Consulting clients. Features cross-portal single sign-on via a custom auth provider, seamless session handoff, and a clean interface tailored for end users. Live in production.',
    tech:        ['Laravel 11', 'Livewire', 'Alpine.js', 'MySQL', 'Tailwind CSS', 'Laravel Sanctum'],
    github:      null,
    demo:        "https://help.eclectic.co.id/",
    images:      [],
  },
  {
    title:       'Tennis Artist Academy',
    description: 'Production website for Tennis Artist Academy featuring course catalog, registration flow, and integrated checkout. Built with a clean, mobile-first design focused on conversion and ease of use.',
    tech:        ['React.js', 'Vite', 'Tailwind CSS'],
    github:      null,
    demo:        "https://tennisartistacademy.com/",
    images:      [],
  },
  {
    title:       'Baratie Restaurant',
    description: 'A full-stack restaurant management system built to handle real daily operations. Covers real-time inventory tracking, integrated payment processing, and a centralized admin dashboard for managing orders, menus, and staff.',
    tech:        ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github:      "https://github.com/Seafarer07/BaratieResto",
    demo:        null,
    images:      [baratieImg],
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

/* ─── Available Badge ─────────────────────────────────────────────────────── */

const AvailableBadge = () => (
  <div className="avail-badge">
    <span className="avail-dot" aria-hidden="true" />
    Open to Opportunities
  </div>
);

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

const Sidebar = ({ active }) => (
  <aside className="sidebar">
    <div className="sidebar__info">
      <h1 className="sidebar__name">Natanael Adi<br />Wicaksono</h1>
      <p className="sidebar__role">Full Stack Developer</p>
      <p className="sidebar__tagline">
        I design and ship web applications that businesses can actually depend on, from the first line of code to production.
      </p>
      <AvailableBadge />
    </div>

    <nav className="sidebar__nav" aria-label="Page sections">
      {NAV_ITEMS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          className={`sidebar__link${active === id ? ' sidebar__link--active' : ''}`}
          style={{ animationDelay: `${0.5 + i * 0.08}s` }}
        >
          <span className="sidebar__indicator" aria-hidden="true" />
          <span className="sidebar__label">
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </span>
        </a>
      ))}
    </nav>

    <div className="sidebar__socials">
      <a href="https://github.com/Seafarer07" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Github size={19} />
      </a>
      <a href="https://www.linkedin.com/in/natanaeladiwicaksono/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <Linkedin size={19} />
      </a>
      <a href="https://www.instagram.com/natanaelaw_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <Instagram size={19} />
      </a>
      <a href="mailto:wicaksonoadinatanael@gmail.com" aria-label="Email">
        <Mail size={19} />
      </a>
    </div>
  </aside>
);

/* ─── About ───────────────────────────────────────────────────────────────── */

const About = () => {
  const [bodyRef,   bodyInView]   = useInView(0.1);
  const [skillsRef, skillsInView] = useInView(0.1);

  return (
    <section id="about" className="content-section">
      <h2 className="section-heading">About</h2>

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
          Currently a Management Trainee at{' '}
          <a href="https://eclectic.co.id" target="_blank" rel="noopener noreferrer" className="inline-link">
            Eclectic Consulting
          </a>
          , rebuilding enterprise authorization for multi-org platforms. Also spent two semesters as
          an Assistant Lecturer, teaching 200+ students sharpened how I think and communicate.
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
    <section id="experience" className="content-section">
      <h2 className="section-heading">Experience</h2>
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
              {e.company}
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

const ProjCard = ({ p, delay }) => {
  const [ref, inView] = useInView(0);
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = p.images && p.images.length > 0;
  const multi     = hasImages && p.images.length > 1;

  const prev = useCallback(e => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + p.images.length) % p.images.length);
  }, [p.images]);

  const next = useCallback(e => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % p.images.length);
  }, [p.images]);

  return (
    <article
      ref={ref}
      className={`proj-card reveal${inView ? ' in' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {hasImages && (
        <div className="proj-img">
          <img src={p.images[imgIdx]} alt={`${p.title} preview ${imgIdx + 1}`} loading="lazy" />
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
                    onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div className="proj-body">
        <header className="proj-header">
          <span className="proj-eyebrow">Featured Project</span>
          <div className="proj-links">
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={18} />
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </header>
        <h3 className="proj-name">{p.title}</h3>
        <p className="proj-desc">{p.description}</p>
        <ul className="proj-tech">
          {p.tech.map(t => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </article>
  );
};

const Projects = () => (
  <section id="projects" className="content-section">
    <h2 className="section-heading">Projects</h2>
    <div className="proj-list">
      {PROJECTS.map((p, i) => (
        <ProjCard key={p.title} p={p} delay={i * 60} />
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
    <section id="contact" className="content-section">
      <h2 className="section-heading">Contact</h2>
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
        <button type="submit" className="contact-btn" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

/* ─── Footer ──────────────────────────────────────────────────────────────── */

const Footer = () => (
  <footer className="footer">
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

  return (
    <div className="layout">
      <Sidebar active={active} />
      <main className="main-content">
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default App;
