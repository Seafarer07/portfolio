import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { EMAIL, EMAILJS } from '../data/site';
import { useInView } from '../hooks/useInView';
import { useT } from '../i18n';

const LIMITS = { name: 100, email: 254, message: 2000 };
const MIN_MESSAGE = 10;
const COOLDOWN_MS = 30_000;      // minimum gap between sends from one browser
const MIN_FILL_MS = 2_000;       // humans need longer than this to fill the form
const COOLDOWN_KEY = 'contact-last-sent';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form, e) => {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();
  if (!name) errors.name = e.nameRequired;
  if (!email) errors.email = e.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = e.emailInvalid;
  if (!message) errors.message = e.messageRequired;
  else if (message.length < MIN_MESSAGE) errors.message = e.messageShort;
  return errors;
};

const cooldownLeft = () => {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
    return Math.max(0, COOLDOWN_MS - (Date.now() - last));
  } catch { return 0; }
};

const Field = ({ id, label, error, children }) => (
  <div className="form-field">
    <label htmlFor={id}><span>{label}</span></label>
    {children}
    {error && <p id={`${id}-error`} className="form-error">{error}</p>}
  </div>
);

export const Contact = memo(() => {
  const { t } = useT();
  const c = t.contact;
  const [formRef, formInView] = useInView(0.1);
  const [form,   setForm]   = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);   // null | 'sending' | 'ok' | 'err' | 'wait'
  const [waitSec, setWaitSec] = useState(0);
  const honeypot = useRef(null);
  const openedAt = useRef(Date.now());
  const fieldRefs = useRef({});

  const set = useCallback(field => e => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  useEffect(() => {
    if (status !== 'ok' && status !== 'err' && status !== 'wait') return;
    const timer = setTimeout(() => setStatus(null), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  const submit = useCallback(async e => {
    e.preventDefault();

    const found = validate(form, c.errors);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = ['name', 'email', 'message'].find(k => found[k]);
      fieldRefs.current[first]?.focus();
      return;
    }

    // Bots fill hidden fields or submit instantly. Pretend success, send nothing.
    if (honeypot.current?.value || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('ok');
      setForm({ name: '', email: '', message: '' });
      return;
    }

    const left = cooldownLeft();
    if (left > 0) {
      setWaitSec(Math.ceil(left / 1000));
      setStatus('wait');
      return;
    }

    if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) {
      setStatus('err');
      return;
    }

    setStatus('sending');
    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name:  form.name.trim(),
          from_email: form.email.trim(),
          email:      form.email.trim(),
          message:    form.message.trim(),
          to_email:   EMAIL,
        },
        EMAILJS.publicKey,
      );
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch { /* storage unavailable */ }
      setStatus('ok');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('err');
    }
  }, [form, c.errors]);

  const sending = status === 'sending';
  const fieldProps = key => ({
    id: `contact-${key}`,
    ref: el => { fieldRefs.current[key] = el; },
    value: form[key],
    onChange: set(key),
    disabled: sending,
    required: true,
    maxLength: LIMITS[key],
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
  });

  return (
    <section id="contact" className="content-section content-section--contact" aria-labelledby="contact-title">
      <p className="contact-eyebrow" aria-hidden="true">{c.eyebrow}</p>
      <h2 id="contact-title" className="contact-title">{c.title}</h2>
      <p className="contact-intro">{c.intro}</p>

      <div className="status-region" role="status" aria-live="polite">
        {status === 'ok' && <p className="status-msg status-ok">{c.ok}</p>}
        {status === 'wait' && <p className="status-msg status-err">{c.wait(waitSec)}</p>}
      </div>
      {status === 'err' && (
        <p className="status-msg status-err" role="alert">
          {c.errA}
          <a href={`mailto:${EMAIL}`} className="inline-link">{EMAIL}</a>
        </p>
      )}

      <form
        ref={formRef}
        className={`contact-form reveal${formInView ? ' in' : ''}`}
        onSubmit={submit}
        noValidate
      >
        <div className="form-row">
          <Field id="contact-name" label={c.name} error={errors.name}>
            <input type="text" autoComplete="name" placeholder={c.namePh} {...fieldProps('name')} />
          </Field>
          <Field id="contact-email" label={c.email} error={errors.email}>
            <input type="email" autoComplete="email" placeholder={c.emailPh} {...fieldProps('email')} />
          </Field>
        </div>
        <Field id="contact-message" label={c.message} error={errors.message}>
          <textarea rows={5} placeholder={c.messagePh} {...fieldProps('message')} />
        </Field>

        {/* Honeypot: invisible to people and screen readers, tempting to bots. */}
        <div className="hp" aria-hidden="true">
          <label>
            Website
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <button type="submit" className="btn contact-btn" disabled={sending}>
          {sending ? c.sending : c.send}
        </button>
      </form>
    </section>
  );
});
