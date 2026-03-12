import React, {
  useState, useEffect, useRef, useCallback, useMemo,
  createContext,
} from 'react';
import {
  Code2, GraduationCap, Mail, Github, Linkedin,
  Menu, X, ExternalLink, ChevronRight, ChevronLeft,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import baratieImg   from './assets/images/baratie.png';
import reusemartImg from './assets/images/reusemart.png';
import './App.css';

// ─── Theme ────────────────────────────────────────────────────────────────────
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── useInView ────────────────────────────────────────────────────────────────
// Fires once when element enters the viewport; disconnects after that.
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

// ─── MouseSpotlight ───────────────────────────────────────────────────────────
// Single global spotlight; uses RAF + direct DOM mutation — zero re-renders.
const MouseSpotlight = React.memo(() => {
  const spotRef = useRef(null);

  useEffect(() => {
    let rafId;
    const onMove = ({ clientX, clientY }) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = spotRef.current;
        if (el) {
          el.style.left = `${clientX}px`;
          el.style.top  = `${clientY}px`;
        }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={spotRef} className="mouse-spotlight" aria-hidden="true" />;
});

// ─── Particles ────────────────────────────────────────────────────────────────
// Memoised so positions never re-randomise on parent re-render.
const Particles = React.memo(({ count = 12 }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id:       i,
        size:     Math.random() * 3 + 2,
        opacity:  Math.random() * 0.2 + 0.05,
        left:     Math.random() * 100,
        top:      Math.random() * 100,
        duration: Math.random() * 12 + 10,
        delay:    Math.random() * 6,
      })),
    [count],
  );

  return (
    <div className="particles" aria-hidden="true">
      {items.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width:     p.size,
            height:    p.size,
            opacity:   p.opacity,
            left:      `${p.left}%`,
            top:       `${p.top}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

// ─── Navigation ───────────────────────────────────────────────────────────────
const Navigation = () => {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const navItems = ['About', 'Skills', 'Projects', 'Journey', 'Contact'];

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav__inner">
        <a href="#" className="nav__logo">
          Mas El<span>.</span>
        </a>

        {/* Desktop links */}
        <div className="nav__links">
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav__link">
              {item}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="nav__hamburger"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav__mobile">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav__mobile-link"
              onClick={close}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [ref, inView] = useInView(0.05);

  return (
    <section className="hero" ref={ref}>
      <Particles count={22} />
      <div className={`hero__content animate${inView ? ' in-view' : ''}`}>
        <p className="hero__tag">Full Stack Developer</p>
        <h1 className="hero__title">
          Crafting Digital<br />Experiences
        </h1>
        <p className="hero__subtitle">
          Passionate computer science student specializing in building exceptional
          web applications with modern technologies and best practices.
        </p>
        <div className="hero__cta">
          <a href="#contact" className="btn btn--primary">
            Get In Touch <ChevronRight size={18} />
          </a>
          <a href="#projects" className="btn btn--outline">
            View Work
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── About ────────────────────────────────────────────────────────────────────
const About = React.memo(() => {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="section" ref={ref}>
      <Particles count={8} />
      <div className="container">
        <h2 className={`section-title animate${inView ? ' in-view' : ''}`}>
          About Me
        </h2>
        <div className={`about__grid animate animate-d2${inView ? ' in-view' : ''}`}>
          <div className="about__text">
            <p>
              I'm a Computer Science student with a deep passion for creating elegant
              solutions to complex problems. My journey in software development combines
              academic knowledge with hands-on project experience.
            </p>
            <p>
              I believe in writing clean, maintainable code and staying current with
              industry best practices. Always eager to learn new technologies and
              contribute to meaningful projects.
            </p>
          </div>
          <div className="about__card">
            <div className="about__card-header">
              <GraduationCap size={22} />
              <h3>Education</h3>
            </div>
            <p>
              Computer Science Student<br />
              Atma Jaya University Yogyakarta<br />
              2022 – Present
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

// ─── Skills ───────────────────────────────────────────────────────────────────
const SKILL_CATEGORIES = [
  { title: 'Frontend', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'] },
  { title: 'Backend',  skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API'] },
  { title: 'Tools',    skills: ['Git', 'Docker', 'AWS', 'Figma', 'CI/CD'] },
];

const Skills = React.memo(() => {
  const [ref, inView] = useInView();

  return (
    <section id="skills" className="section" ref={ref}>
      <Particles count={8} />
      <div className="container">
        <h2 className={`section-title animate${inView ? ' in-view' : ''}`}>
          Skills &amp; Technologies
        </h2>
        <div className="skills__grid">
          {SKILL_CATEGORIES.map((cat, i) => (
            <div
              key={cat.title}
              className={`skill-card animate animate-d${i + 1}${inView ? ' in-view' : ''}`}
            >
              <div className="skill-card__title">{cat.title}</div>
              <div className="skill-card__tags">
                {cat.skills.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ─── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title:       'Baratie Restaurant',
    description: 'Full-stack restaurant management solution with real-time inventory, payment integration, and an admin dashboard.',
    tech:        ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github:      'https://github.com/Seafarer07',
    demo:        '#',
    image:       baratieImg,
  },
  {
    title:       'Reuse Mart',
    description: 'Marketplace platform for buying and selling second-hand goods, featuring advanced filtering and seller tools.',
    tech:        ['Laravel', 'Tailwind CSS', 'MySQL'],
    github:      '#',
    demo:        '#',
    image:       reusemartImg,
  },
  {
    title:       'Real-time Chat App',
    description: 'Scalable chat platform with WebSocket support, end-to-end encryption, file sharing, and group messaging.',
    tech:        ['React', 'Socket.io', 'Express', 'Redis'],
    github:      '#',
    demo:        '#',
  },
  {
    title:       'Portfolio Website',
    description: 'Modern personal portfolio with smooth animations, responsive design, and EmailJS contact integration.',
    tech:        ['React', 'Vite', 'EmailJS'],
    github:      '#',
    demo:        '#',
  },
  {
    title:       'E-Learning Platform',
    description: 'Comprehensive LMS with video streaming, progress tracking, and interactive quiz modules.',
    tech:        ['Vue.js', 'Node.js', 'MongoDB', 'AWS S3'],
    github:      '#',
    demo:        '#',
  },
];

const Projects = () => {
  const [ref, inView]   = useInView();
  const trackRef        = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  const scroll = useCallback((dir) => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  }, []);

  return (
    <section id="projects" className="section" ref={ref}>
      <Particles count={8} />
      <div className="container">
        <div className={`projects__header animate${inView ? ' in-view' : ''}`}>
          <div>
            <h2 className="section-title">Featured Projects</h2>
            <p className="projects__hint">Drag or use arrows to explore →</p>
          </div>
          <div className="projects__nav">
            <button
              className="scroll-btn"
              onClick={() => scroll('left')}
              disabled={!canLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="scroll-btn"
              onClick={() => scroll('right')}
              disabled={!canRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className={`projects__track animate animate-d2${inView ? ' in-view' : ''}`}
        >
          {PROJECTS.map(proj => (
            <div key={proj.title} className="project-card">
              <div
                className="project-card__img"
                style={
                  proj.image
                    ? { backgroundImage: `url(${proj.image})` }
                    : { background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }
                }
              >
                {!proj.image && <Code2 size={52} style={{ color: 'rgba(255,255,255,0.12)' }} />}
              </div>
              <div className="project-card__body">
                <h3 className="project-card__title">{proj.title}</h3>
                <p className="project-card__desc">{proj.description}</p>
                <div className="project-card__tech">
                  {proj.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
                </div>
                <div className="project-card__links">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <Github size={16} /> Code
                  </a>
                  <a
                    href={proj.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <ExternalLink size={16} /> Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Journey / Timeline ───────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    company:     'Tech Startup Inc',
    role:        'Full Stack Developer Intern',
    period:      'Jun 2023 – Present',
    description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality features on tight deadlines.',
    icon:        '🚀',
    color:       '#3b82f6',
  },
  {
    company:     'Digital Agency',
    role:        'Frontend Developer',
    period:      'Jan 2023 – May 2023',
    description: 'Built responsive and interactive user interfaces for client projects. Implemented modern design patterns and accessibility best practices.',
    icon:        '💼',
    color:       '#8b5cf6',
  },
  {
    company:     'Freelance',
    role:        'Web Developer',
    period:      '2022 – Present',
    description: 'Delivered custom web solutions for various clients. Specialised in React, WordPress, and e-commerce platforms with a focus on performance.',
    icon:        '💻',
    color:       '#10b981',
  },
  {
    company:     'University Lab',
    role:        'Research Assistant',
    period:      'Aug 2022 – Dec 2022',
    description: 'Assisted in machine learning and data-analysis research projects. Developed prototypes and maintained thorough documentation.',
    icon:        '🎓',
    color:       '#f59e0b',
  },
];

const Journey = React.memo(() => {
  const [ref, inView] = useInView();

  return (
    <section id="journey" className="section" ref={ref}>
      <Particles count={10} />
      <div className="container">
        <div className={`timeline-header animate${inView ? ' in-view' : ''}`}>
          <p className="section-tag">Experience</p>
          <h2 className="section-title">Where I've Worked</h2>
          <p>Companies and organisations I've had the pleasure to work with.</p>
        </div>

        <div className={`timeline animate animate-d2${inView ? ' in-view' : ''}`}>
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.company}
              className={`tl-item${i % 2 !== 0 ? ' tl-item--right' : ''}`}
            >
              <div
                className="tl-card"
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = exp.color;
                  e.currentTarget.style.boxShadow   = `0 12px 32px ${exp.color}22`;
                  e.currentTarget.style.transform   = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow   = '';
                  e.currentTarget.style.transform   = '';
                }}
              >
                <span
                  className="tl-period"
                  style={{ background: `${exp.color}18`, color: exp.color }}
                >
                  {exp.period}
                </span>
                <div className="tl-role">{exp.role}</div>
                <div className="tl-company" style={{ color: exp.color }}>{exp.company}</div>
                <p className="tl-desc">{exp.description}</p>
              </div>

              <div
                className="tl-icon"
                style={{
                  background: `linear-gradient(135deg, ${exp.color} 0%, ${exp.color}bb 100%)`,
                  boxShadow:  `0 4px 16px ${exp.color}44`,
                }}
              >
                {exp.icon}
              </div>

              <div className="tl-spacer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_META = {
  success: { color: '#10b981', icon: '✓', title: 'Success!' },
  error:   { color: '#ef4444', icon: '✕', title: 'Error!'   },
  info:    { color: '#3b82f6', icon: 'i', title: 'Info'     },
};

const Toast = React.memo(({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const meta = TOAST_META[type];

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <div className="toast__icon" style={{ background: meta.color }}>
        {meta.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div className="toast__title">{meta.title}</div>
        <div className="toast__msg">{message}</div>
      </div>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
});

// ─── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [ref, inView] = useInView();
  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const set = useCallback(
    field => e => setForm(f => ({ ...f, [field]: e.target.value })),
    [],
  );

  const closeToast = useCallback(() => setToast(null), []);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
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
        setToast({ message: "Message sent! I'll get back to you soon.", type: 'success' });
        setForm({ name: '', email: '', message: '' });
      } catch {
        setToast({ message: 'Failed to send. Please email me directly.', type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  return (
    <section id="contact" className="section" ref={ref}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <Particles count={8} />

      <div className="container contact__inner">
        <h2
          className={`section-title animate${inView ? ' in-view' : ''}`}
          style={{ textAlign: 'center' }}
        >
          Let's Work Together
        </h2>

        <p className={`contact__subtitle animate animate-d1${inView ? ' in-view' : ''}`}>
          Have a project in mind? Let's discuss how we can work together.
        </p>

        <form
          className={`contact__form animate animate-d2${inView ? ' in-view' : ''}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              className="form-input"
              value={form.name}
              onChange={set('name')}
              disabled={loading}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              value={form.email}
              onChange={set('email')}
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              required
              className="form-textarea"
              value={form.message}
              onChange={set('message')}
              disabled={loading}
              placeholder="Your message…"
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>

        <div className={`contact__socials animate animate-d3${inView ? ' in-view' : ''}`}>
          <a
            href="https://github.com/Seafarer07"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/natanaeladiwicaksono/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:wicaksonoadinatanael@gmail.com"
            className="social-link"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = React.memo(() => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} Mas El Portfolio. Built with React &amp; passion.</p>
  </footer>
));

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => (
  <ThemeProvider>
    <MouseSpotlight />
    <Navigation />
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Contact />
    </main>
    <Footer />
  </ThemeProvider>
);

export default App;
