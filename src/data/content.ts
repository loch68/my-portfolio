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
  /** Secondary identifier shown beside the category when useful. */
  alias?: string;
  status?: { kind: ProjectStatus; label: string };
  description: string;
  /** Concise card copy used below the desktop breakpoint. */
  descriptionShort: string;
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
    category: 'Travel & Tourism',
    status: { kind: 'live', label: 'Live' },
    description:
      'A Sri Lanka tourism website for private van tours and scenic journeys, from site architecture to guest-facing detail.',
    descriptionShort:
      'Sri Lanka tourism website for private van tours and scenic journeys.',
    tags: ['Website Development', 'Private van tours', 'Scenic journeys'],
    image: {
      src: asset('images/projectImages/ceylonpathways.webp'),
      alt: 'Ceylon Pathways redesigned travel website hero for private van tours and scenic journeys in Sri Lanka',
      width: 1600,
      height: 874,
      caption: 'ceylon-pathways.vercel.app — live site',
    },
    link: {
      href: 'https://ceylon-pathways.vercel.app',
      label: 'Visit website',
      external: true,
    },
  },
  {
    id: 'telca-solutions-cctv',
    index: '02',
    title: 'Telca Solutions CCTV',
    category: 'Web Development',
    status: { kind: 'construction', label: 'Under Construction' },
    description:
      'A CCTV quotation application with a categorized product catalogue, quotation builder, request submission, and admin catalogue management.',
    descriptionShort:
      'CCTV catalogue and quotation system with an admin interface.',
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
    category: 'Web Development',
    description:
      'A print-on-demand service and online bookshop for NethwinLK Printers (Pvt) Ltd., where customers can explore the book collection and place print orders.',
    descriptionShort: 'Print-on-demand bookshop for NethwinLK Printers.',
    tags: ['E-commerce', 'Print on Demand'],
    image: {
      src: asset('projects/nethwin-bookshop.jpg'),
      alt: 'Green and white NethwinLK landing page with print-on-demand and bookshop entry cards',
      width: 1600,
      height: 879,
      caption: 'print & bookshop project — NethwinLK Printers',
    },
  },
  {
    id: 'ps-portfolio',
    index: '04',
    title: 'Campus Portfolio',
    alias: 'PS Portfolio',
    category: 'Academic',
    description:
      'Academic, teamwork, and creative technology projects built through college and community initiatives.',
    descriptionShort: 'Academic and community technology projects.',
    tags: ['Student Work', 'Creative Technology'],
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
  /** The short labels shown before the disclosure is opened. */
  highlights: string[];
  /** The complete list shown inside "What's included". */
  details: string[];
  /** Platform names presented as a compact metadata row. */
  platforms?: string[];
}

export const SERVICES: ServiceCategory[] = [
  {
    index: '01',
    title: 'Web Development',
    summary: 'Websites and digital product interfaces for businesses and projects.',
    highlights: [
      'Website design and development',
      'Frontend development',
      'Business websites',
      'Digital product interfaces',
    ],
    details: [
      'Website design and development',
      'Frontend development',
      'Business websites',
      'Landing pages',
      'Digital product interfaces',
    ],
  },
  {
    index: '02',
    title: 'Branding & Design',
    summary: 'Brand identity, graphic design, and marketing materials.',
    highlights: [
      'Brand identity',
      'Logo and graphic design',
      'Visual communication',
      'Marketing materials',
    ],
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
    summary: 'Video, photography, and visual content for brands and digital platforms.',
    highlights: [
      'Video editing',
      'Photography',
      'Videography',
      'Promotional videos',
    ],
    details: [
      'Video editing',
      'Photography',
      'Videography',
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
      'Online presence and booking support for accommodation and tourism businesses.',
    platforms: ['Booking.com', 'Agoda', 'Airbnb', 'TripAdvisor', 'Google Business'],
    highlights: [
      'Accommodation listings',
      'Property descriptions',
      'Booking operations',
    ],
    details: [
      'Accommodation listing improvements',
      'Property-description writing',
      'Online booking operations',
    ],
  },
  {
    index: '05',
    title: 'Digital Marketing & Content',
    summary: 'Content, copywriting, and social media for businesses.',
    highlights: [
      'Social media management',
      'Content writing',
      'Digital copywriting',
      'Website content',
    ],
    details: [
      'Social media management',
      'Content writing',
      'Digital copywriting',
      'Website content',
      'Promotional content',
    ],
  },
] as const;

export interface EducationEntry {
  institution: string;
  qualification: string;
  /** A type label, not a date. The available data has no chronology. */
  period: string;
}

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'Gamini Central College, Nuwara Eliya',
    qualification: 'GCE Advanced Level & Ordinary Level',
    period: 'School education',
  },
  {
    institution: 'NIBM (National Institute of Business Management)',
    qualification: 'Computer Science Certification',
    period: 'Professional certification',
  },
  {
    institution: 'SLIIT City University (University of Bedfordshire partnership)',
    qualification: 'HND in Information Technology',
    period: 'Higher National Diploma',
  },
];

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
  whatsapp: {
    label: 'WhatsApp',
    href: 'https://wa.me/94778660753',
  },
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/lochgraphy' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/',
    },
    { label: 'GitHub', href: 'https://github.com/loch68' },
  ],
} as const;
