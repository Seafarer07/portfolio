import { Github, Linkedin, Instagram } from 'lucide-react';
import reusemartImg from '../assets/images/reusemart.webp';
import Baratie1 from '../assets/images/Baratie1.webp';
import Baratie2 from '../assets/images/Baratie2.webp';
import Baratie3 from '../assets/images/Baratie3.webp';
import Eco1 from '../assets/images/Eco1.webp';
import Eco2 from '../assets/images/Eco2.webp';
import Eco3 from '../assets/images/Eco3.webp';
import J1 from '../assets/images/J1.webp';
import J2 from '../assets/images/J2.webp';
import TA1 from '../assets/images/TA1.webp';
import TA2 from '../assets/images/TA2.webp';
import TA3 from '../assets/images/TA3.webp';

/* Language-independent site data. Translatable copy lives in translations.js. */

export const NAV_ITEMS = ['about', 'experience', 'projects', 'contact'];

export const EMAIL = 'wicaksonoadinatanael@gmail.com';

export const SOCIALS = [
  { label: 'GitHub',    href: 'https://github.com/Seafarer07',                     Icon: Github },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/natanaeladiwicaksono/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/natanaelaw_/',            Icon: Instagram },
];

export const SKILL_GROUPS = [
  { id: 'frameworks',   items: ['Laravel 11', 'Livewire', 'Alpine.js', 'React.js', 'Vite', 'Tailwind CSS'] },
  { id: 'languages',    items: ['PHP', 'JavaScript', 'Python', 'Java', 'C', 'SQL', 'HTML', 'CSS'] },
  { id: 'tools',        items: ['Git', 'GitHub', 'Figma', 'Canva'] },
  { id: 'integrations', items: ['MySQL', 'Laravel Sanctum', 'REST APIs', 'OAuth 2.0 Microsoft', 'IMAP / SSO'] },
];

export const PROJECTS = [
  {
    id:     'ecosystem',
    title:  'Ecosystem',
    tech:   ['Laravel 11', 'Livewire', 'Alpine.js', 'MySQL', 'Tailwind CSS', 'Laravel Sanctum'],
    github: null,
    demo:   'https://me.eclectic.co.id/',
    images: [Eco1, Eco2, Eco3],
  },
  {
    id:     'jarvies',
    title:  'Jarvies',
    tech:   ['Laravel 11', 'Livewire', 'Alpine.js', 'MySQL', 'Tailwind CSS', 'Laravel Sanctum'],
    github: null,
    demo:   'https://help.eclectic.co.id/',
    images: [J1, J2],
  },
  {
    id:     'tennis',
    title:  'Tennis Artist Academy',
    tech:   ['React.js', 'Vite', 'Tailwind CSS'],
    github: null,
    demo:   'https://tennisartistacademy.com/',
    images: [TA1, TA2, TA3],
  },
  {
    id:     'baratie',
    title:  'Baratie Restaurant',
    tech:   ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github: 'https://github.com/Seafarer07/BaratieResto',
    demo:   null,
    images: [Baratie1, Baratie2, Baratie3],
  },
  {
    id:     'reusemart',
    title:  'Reuse Mart',
    tech:   ['Laravel', 'Tailwind CSS', 'MySQL'],
    github: 'https://github.com/Seafarer07/ReuseMart',
    demo:   null,
    images: [reusemartImg],
  },
];

/* EmailJS credentials come from the environment (see .env.example). */
export const EMAILJS = {
  serviceId:  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey:  import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
