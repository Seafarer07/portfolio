import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { PROJECTS } from '../data/site';
import { useInView } from '../hooks/useInView';
import { useSwipe } from '../hooks/useSwipe';
import { useT } from '../i18n';
import { SectionHeading } from './Chrome';

/* Native <dialog> gives a focus trap, Esc to close and a backdrop for free. */
const Lightbox = ({ project, index, onPrev, onNext, onClose }) => {
  const { t } = useT();
  const p = t.projects;
  const ref = useRef(null);
  const multi = project.images.length > 1;
  const swipe = useSwipe(onNext, onPrev);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const onKeyDown = e => {
    if (e.key === 'ArrowLeft' && multi) onPrev();
    if (e.key === 'ArrowRight' && multi) onNext();
  };

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={`${project.title}, ${p.position(index + 1, project.images.length)}`}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={e => { if (e.target === ref.current) ref.current.close(); }}
    >
      <div className="lightbox__inner" {...swipe}>
        <img
          src={project.images[index]}
          alt={p.alt(project.title, index + 1)}
          width="1100"
          height="558"
        />
        <button type="button" className="lightbox__close" onClick={() => ref.current.close()} aria-label={p.close}>
          <X size={20} aria-hidden="true" />
        </button>
        {multi && (
          <>
            <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label={p.prev}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label={p.next}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
};

const Carousel = ({ project }) => {
  const { t } = useT();
  const p = t.projects;
  const { images, title } = project;
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const multi = images.length > 1;

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);
  const swipe = useSwipe(next, prev);

  const onKeyDown = e => {
    if (!multi) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  return (
    <>
    <div
      className="proj-img"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title}, ${p.carousel}`}
      onKeyDown={onKeyDown}
      {...swipe}
    >
      <div className="proj-track" style={{ transform: `translate3d(${-100 * idx}%, 0, 0)` }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={p.alt(title, i + 1)}
            width="1100"
            height="558"
            decoding="async"
            loading="lazy"
            aria-hidden={i !== idx}
            onClick={() => setZoom(true)}
          />
        ))}
      </div>

      <button type="button" className="proj-img__expand" onClick={() => setZoom(true)} aria-label={`${p.expand}: ${title}`}>
        <Maximize2 size={16} aria-hidden="true" />
      </button>

      {multi && (
        <>
          <button type="button" className="proj-img__arrow proj-img__arrow--prev" onClick={prev} aria-label={p.prev}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="proj-img__arrow proj-img__arrow--next" onClick={next} aria-label={p.next}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <div className="proj-img__dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`proj-img__dot${i === idx ? ' proj-img__dot--active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={p.goTo(i + 1)}
                aria-current={i === idx ? 'true' : undefined}
              />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">{p.position(idx + 1, images.length)}</p>
        </>
      )}

    </div>
    {zoom && (
      <Lightbox project={project} index={idx} onPrev={prev} onNext={next} onClose={() => setZoom(false)} />
    )}
    </>
  );
};

const ProjCard = memo(({ project, reverse }) => {
  const { t } = useT();
  const p = t.projects;
  const [ref, inView] = useInView(0);
  const hasImages = project.images.length > 0;

  return (
    <article
      ref={ref}
      className={`proj-card reveal${inView ? ' in' : ''}${hasImages ? '' : ' proj-card--solo'}${reverse ? ' proj-card--rev' : ''}`}
    >
      {hasImages && <Carousel project={project} />}
      <div className="proj-content">
        <p className="proj-eyebrow">{p.eyebrow}</p>
        <h3 className="proj-name">{project.title}</h3>
        <p className="proj-desc">{p.items[project.id]}</p>
        <ul className="proj-tech" aria-label={p.techLabel}>
          {project.tech.map(tech => <li key={tech}>{tech}</li>)}
        </ul>
        <div className="proj-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title}: ${p.github} (${t.ui.newTab})`}
            >
              <Github size={20} aria-hidden="true" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title}: ${p.demo} (${t.ui.newTab})`}
            >
              <ExternalLink size={20} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
});

export const Projects = memo(() => {
  const { t } = useT();
  return (
    <section id="projects" className="content-section" aria-labelledby="projects-title">
      <SectionHeading num="03" id="projects-title">{t.projects.heading}</SectionHeading>
      <div className="proj-list">
        {PROJECTS.map((project, i) => (
          <ProjCard key={project.id} project={project} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
});
