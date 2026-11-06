import { asset } from '../assets';

/**
 * Central portfolio data — add a new project by appending one object here.
 * No component changes required; the grid adapts automatically.
 *
 * Only include links that resolve to real destinations. When a project has
 * no live URL (academic or internal work), the card still presents fully;
 * only the external action is omitted.
 */

export const SECTION_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
] as const;

export type ProjectStatus = 'live' | 'construction';

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  status?: { kind: ProjectStatus; label: string };
  description: string;
  tags: string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  link?: { href: string; label: string; external?: boolean };
}

export const PROJECTS: Project[] = [
  {
    id: 'ceylon-pathways',
    index: '01',
    title: 'Ceylon Pathways',
    category: 'Travel & Tourism · Web Development',
    status: { kind: 'live', label: 'Live' },
    description:
      'A travel-focused digital experience presenting Sri Lankan tourism through a dedicated online platform — private van tours and scenic journeys, from site architecture to guest-facing detail.',
    tags: ['Travel & Tourism', 'Website Development', 'Digital Experience'],
    image: {
      src: asset('projects/ceylon-pathways.jpg'),
      alt: 'Ceylon Pathways travel website hero with a group photo of travelers and the headline "Explore Sri Lanka with Comfort & Confidence"',
      width: 1600,
      height: 843,
      caption: 'ceylonpathways.vercel.app — live site',
    },
    link: {
      href: 'https://ceylon-pathways.vercel.app',
      label: 'Visit Live Website',
      external: true,
    },
  },
  {
    id: 'telca-solutions-cctv',
    index: '02',
    title: 'Telca Solutions CCTV',
    category: 'Web Development · Digital Business Solution',
    status: { kind: 'construction', label: 'Under Construction' },
    description:
      'A business application for CCTV quotation workflows: browse a product catalogue by category, build a quotation selection, submit a quotation request, and manage the catalogue from an admin interface.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Cloudinary'],
    image: {
      src: asset('projects/telca-cctv.jpg'),
      alt: 'Telca Solutions CCTV website hero with a security camera against a cloudy sky and the headline "Security products, quoted for your project"',
      width: 1600,
      height: 857,
      caption: 'catalogue & quotation system — in active development',
    },
  },
  {
    id: 'nethwin-bookshop',
    index: '03',
    title: 'Nethwin Bookshop',
    category: 'Web Development · Bookshop Digital Project',
    description:
      'Digital presence for NethwinLK Printers (Pvt) Ltd. — a print-on-demand service and online bookshop where customers can explore the book collection and place print orders.',
    tags: ['Web Development', 'E-commerce', 'Print on Demand'],
    image: {
      src: asset('projects/nethwin-bookshop.jpg'),
      alt: 'Green and white NethwinLK landing page with print-on-demand and bookshop entry cards',
      width: 1600,
      height: 879,
      caption: 'nethwinlk.com — print & bookshop project',
    },
  },
  {
    id: 'ps-portfolio',
    index: '04',
    title: 'Campus Portfolio (PS Portfolio)',
    category: 'Academic · Personal Portfolio Project',
    description:
      'A curated showcase of academic work, teamwork, and creative technology projects built through college and community initiatives.',
    tags: ['Academic Portfolio', 'Student Work', 'Creative Technology'],
    image: {
      src: asset('projects/ps-portfolio.jpg'),
      alt: 'Student showcase portfolio landing page with a classical statue backdrop and the title "Professional Skills Portfolio"',
      width: 1600,
      height: 879,
      caption: 'student portfolio project',
    },
  },
];

export interface ServiceCategory {
  index: string;
  title: string;
  brand?: string;
  summary: string;
  details: string[];
}

export const SERVICES: ServiceCategory[] = [
  {
    index: '01',
    title: 'Web Development',
    summary:
      'Building practical websites and digital experiences for businesses and projects.',
    details: [
      'Website design and development',
      'Frontend development',
      'Business websites',
      'Landing pages',
      'Digital product interfaces',
      'Practical digital solutions',
    ],
  },
  {
    index: '02',
    title: 'Branding & Design',
    summary:
      'Helping businesses communicate their identity through thoughtful visual design.',
    details: [
      'Brand identity',
      'Logo and graphic design',
      'Visual communication',
      'Marketing materials',
      'Digital design assets',
    ],
  },
  {
    index: '03',
    title: 'Video Editing & Creative Production',
    brand: 'LOCHGRAPHY',
    summary:
      'Creative production and visual storytelling for brands, individuals, and digital platforms.',
    details: [
      'Video editing',
      'Photography',
      'Videography',
      'Visual storytelling',
      'Creative content production',
      'Promotional videos',
      'Social media visual content',
    ],
  },
  {
    index: '04',
    title: 'Travel & Hospitality Digital Support',
    brand: 'Nuwara Eliya Travel & Hospitality Consultancy',
    summary:
      'Supporting accommodation and tourism businesses with their online presence and booking operations.',
    details: [
      'Booking.com management',
      'Agoda listing management',
      'Airbnb presence support',
      'TripAdvisor presence support',
      'Google Business support',
      'Accommodation listing improvements',
      'Property-description writing',
      'Tourism business digital presence',
      'Online booking operations',
    ],
  },
  {
    index: '05',
    title: 'Digital Marketing & Content',
    summary:
      'Supporting businesses with digital communication, content, and online promotion.',
    details: [
      'Social media management',
      'Content writing',
      'Digital copywriting',
      'Website content',
      'Promotional content',
      'Business-focused digital communication',
    ],
  },
] as const;

export interface EducationEntry {
  institution: string;
  qualification: string;
  period: string;
  status: string;
  detail?: string;
}

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'Gamini Central College, Nuwara Eliya',
    qualification: 'GCE Advanced Level & Ordinary Level',
    period: 'School education',
    status: 'Completed',
  },
  {
    institution: 'NIBM — National Institute of Business Management',
    qualification: 'Computer Science Certification',
    period: 'Professional certification',
    status: 'Completed',
  },
  {
    institution: 'SLIIT City University — University of Bedfordshire partnership',
    qualification: 'HND in Information Technology',
    period: 'Higher National Diploma',
    status: 'Completed',
  },
];

/**
 * Figures shown in About. The first three are derived from the actual content
 * arrays so they can never drift from the work they describe. The line count
 * is the measured project-source total (src/, index.html, vite.config.ts,
 * cloc, 2026-11-06) and should be refreshed when the codebase changes.
 */
export const PORTFOLIO_STATS = [
  { label: 'Selected projects', value: PROJECTS.length },
  { label: 'Service categories', value: SERVICES.length },
  { label: 'Education milestones', value: EDUCATION.length },
  { label: 'Lines of code', value: 4621 },
] as const;

export interface SocialLink {
  label: string;
  href: string;
}

export const CONTACT = {
  email: 'lochgraphy@gmail.com',
  emailAlt: 'lochana211@gmail.com',
  phones: [
    { label: '+94 77 866 0753', href: 'tel:+94778660753' },
    { label: '+94 70 466 9661', href: 'tel:+94704669661' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/lochgraphy' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/',
    },
    { label: 'GitHub', href: 'https://github.com/loch68' },
  ],
} as const;
