import { memo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SKILL_GROUPS } from '../data/site';
import profileImg from '../assets/images/profile.webp';
import { useInView } from '../hooks/useInView';
import { useT } from '../i18n';
import { SectionHeading } from './Chrome';

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const Hero = memo(({ ready }) => {
  const { t } = useT();
  const h = t.hero;

  return (
    <section id="top" className={`hero${ready ? ' hero--in' : ''}`}>
      <h1 className="hero__item hero__title" style={{ '--i': 0 }}>{h.title}</h1>
      <p className="hero__item hero__desc" style={{ '--i': 1 }}>
        {h.descA}
        <a href="https://eclectic.co.id" target="_blank" rel="noopener noreferrer" className="inline-link">
          Eclectic Consulting
        </a>{h.descB}
      </p>
      <div className="hero__item hero__cta" style={{ '--i': 2 }}>
        <a href="#projects" className="btn btn--solid">{h.ctaWork}</a>
        <div className="avail-badge">
          <span className="avail-dot" aria-hidden="true" />
          {h.avail}
        </div>
      </div>
    </section>
  );
});

/* ─── About ───────────────────────────────────────────────────────────────── */

const About = memo(() => {
  const { t } = useT();
  const a = t.about;
  const [bodyRef,   bodyInView]   = useInView(0.1);
  const [skillsRef, skillsInView] = useInView(0.1);

  return (
    <section id="about" className="content-section content-section--about" aria-labelledby="about-title">
      <SectionHeading num="01" id="about-title">{a.heading}</SectionHeading>

      <div ref={bodyRef} className={`about-grid reveal${bodyInView ? ' in' : ''}`}>
        <div className="about-body">
          <p>
            {a.p1a}
            <a href="https://www.uajy.ac.id" target="_blank" rel="noopener noreferrer" className="inline-link">
              Universitas Atma Jaya Yogyakarta
            </a>
            {a.p1b}
          </p>
          <p>{a.p2}</p>
        </div>

        <figure className="about-photo">
          <div className="about-photo__frame">
            <img src={profileImg} alt={a.photoAlt} width="600" height="690" loading="lazy" decoding="async" />
          </div>
        </figure>
      </div>

      <div
        ref={skillsRef}
        className={`skills reveal${skillsInView ? ' in' : ''}`}
        style={{ transitionDelay: '0.1s' }}
        role="group"
        aria-label={a.skillsLabel}
      >
        {SKILL_GROUPS.map((g, gi) => (
          <div key={g.id} className="skills__group">
            <h3 className="skills__label">{a.skillGroups[g.id]}</h3>
            <ul className="skills__chips">
              {g.items.map((item, i) => <li key={item} style={{ '--n': gi * 2 + i }}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

/* ─── Experience ──────────────────────────────────────────────────────────── */

const Experience = memo(() => {
  const { t } = useT();
  const x = t.experience;
  const [active, setActive] = useState(0);
  const [panelRef, panelInView] = useInView(0.1);
  const tabRefs = useRef([]);
  const exp = x.list[active];

  /* WAI-ARIA tabs: arrow keys move focus and selection, Home/End jump. */
  const onKeyDown = e => {
    const last = x.list.length - 1;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="experience" className="content-section content-section--narrow" aria-labelledby="experience-title">
      <SectionHeading num="02" id="experience-title">{x.heading}</SectionHeading>
      <div className="exp-wrap">
        <div className="exp-tabs" role="tablist" aria-label={x.tabsLabel} onKeyDown={onKeyDown}>
          {x.list.map((e, i) => (
            <button
              key={e.id}
              ref={el => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`exp-tab-${e.id}`}
              aria-selected={i === active}
              aria-controls="exp-panel"
              tabIndex={i === active ? 0 : -1}
              className={`exp-tab${i === active ? ' exp-tab--active' : ''}`}
              onClick={() => setActive(i)}
            >
              {e.company}
            </button>
          ))}
        </div>

        <div
          ref={panelRef}
          id="exp-panel"
          className={`exp-panel reveal${panelInView ? ' in' : ''}`}
          role="tabpanel"
          aria-labelledby={`exp-tab-${exp.id}`}
          tabIndex={0}
        >
          <ol key={exp.id} className="exp-roles">
            {exp.roles.map(r => (
              <li key={r.role} className="exp-role">
                <h3 className="exp-title">
                  {r.role}
                  <span className="exp-company"> @ {exp.company}</span>
                </h3>
                <p className="exp-period">{r.period}</p>
                <p className="exp-desc">{r.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <a
        href="https://www.linkedin.com/in/natanaeladiwicaksono/"
        target="_blank"
        rel="noopener noreferrer"
        className="view-more-link"
      >
        {x.linkedin} <ArrowUpRight size={15} aria-hidden="true" />
        <span className="sr-only"> ({t.ui.newTab})</span>
      </a>
    </section>
  );
});

export { Hero, About, Experience };
