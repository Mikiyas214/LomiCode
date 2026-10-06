// ─────────────────────────────────────────────────────────────────────────
// SITE CONFIGURATION
// Edit everything in this file to rebrand the site: name, tagline, colors,
// contact details, services, and portfolio items. Nothing else needs to
// change — components read from here.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: 'Lomi Code',
  shortName: 'Lomi Code',
  tagline: 'Websites and software built to move your business forward.',
  subTagline:
    'We design, build, and improve digital tools that help businesses look professional, work smarter, and grow.',
  motto: 'CODE • INNOVATE • ELEVATE',
  logo: '/brand/lomi-code-logo.svg',
  mark: '/brand/lomi-code-mark.svg',
}

// TODO: These are still the original unverified placeholder values. They were
// deliberately left untouched during the Lomi Code rebrand rather than swapped
// for invented details. Replace every field below with the real Lomi Code
// contact information before launch.
export const contact = {
  email: 'hello@lomicode',
  phoneDisplay: '+251900311265/+251956016403',
  // Digits only, international format, no "+", no spaces — used to build
  // both the footer WhatsApp link and the contact form's pre-filled
  // "Continue on WhatsApp" link. e.g. "15550102030" for +1 555 010 2030.
  whatsappNumber: '251900311265',
  telegram: 'https://t.me/lomicode1',
  instagram: 'https://instagram.com/lomicode',
  linkedin: 'https://linkedin.com/company/lomicode',
  address: 'Addis ababa | Ethiopia · Available worldwide',
}

// Plain WhatsApp link with no pre-filled message (used in the footer /
// contact channel list). The contact form builds its own link with a
// pre-filled inquiry message — see buildWhatsAppLink() below.
contact.whatsapp = `https://wa.me/${contact.whatsappNumber}`

/**
 * Builds a wa.me link pre-filled with a summary of a submitted inquiry,
 * so a visitor can continue the conversation on WhatsApp in one tap.
 */
export function buildWhatsAppLink(inquiry) {
  const lines = [
    `Hi Lomi Code, I just submitted a project inquiry.`,
    `Name: ${inquiry.fullName}`,
    inquiry.businessName ? `Business: ${inquiry.businessName}` : null,
    `Service: ${inquiry.service}`,
    inquiry.budget ? `Budget: ${inquiry.budget}` : null,
    `Details: ${inquiry.details}`,
  ].filter(Boolean)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${contact.whatsappNumber}?text=${text}`
}

export const services = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    summary: 'A fast, professional website that represents your business well.',
    outcomes: [
      'A clear, modern site visitors trust immediately',
      'Mobile-friendly on every device',
      'Built to be easy to update later',
    ],
  },
  {
    id: 'ecommerce-websites',
    title: 'E-commerce Websites',
    summary: 'Online stores built to convert visitors into customers.',
    outcomes: [
      'Smooth browsing and checkout experience',
      'Product catalog structured for growth',
      'Foundation ready for payments and inventory tools',
    ],
  },
  {
    id: 'web-applications',
    title: 'Web Applications',
    summary: 'Custom, interactive tools built around how your team works.',
    outcomes: [
      'Workflows tailored to your business',
      'Clean, intuitive interfaces',
      'Architecture that scales as you grow',
    ],
  },
  {
    id: 'custom-software',
    title: 'Custom Software Solutions',
    summary: 'Purpose-built software that solves problems off-the-shelf tools cannot.',
    outcomes: [
      'Systems designed around your exact process',
      'Fewer manual, repetitive tasks',
      'Documentation so your team stays in control',
    ],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    summary: 'Interfaces that are easy to use and pleasant to look at.',
    outcomes: [
      'Clear visual hierarchy and flow',
      'Consistent design system for future features',
      'Prototypes you can test before building',
    ],
  },
  {
    id: 'maintenance-support',
    title: 'Website Maintenance and Support',
    summary: 'Ongoing care so your site stays fast, secure, and current.',
    outcomes: [
      'Regular updates and monitoring',
      'Quick fixes when issues come up',
      'A dependable point of contact',
    ],
  },
  {
    id: 'branding-digital-presence',
    title: 'Branding and Digital Presence',
    summary: 'A consistent look and voice across your website and channels.',
    outcomes: [
      'A visual identity that fits your business',
      'Consistency across web and social',
      'Assets ready to reuse anywhere',
    ],
  },
]

// Portfolio placeholders — clearly marked as sample content.
// TODO: replace each entry with a real project once available.
export const portfolio = [
  {
    id: 'project-1',
    client: 'Client Name Placeholder',
    category: 'Business Website',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “Faster load times and a cleaner brand presence.”',
  },
  {
    id: 'project-2',
    client: 'Client Name Placeholder',
    category: 'E-commerce',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “Streamlined checkout across devices.”',
  },
  {
    id: 'project-3',
    client: 'Client Name Placeholder',
    category: 'Web Application',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “Automated a manual weekly process.”',
  },
  {
    id: 'project-4',
    client: 'Client Name Placeholder',
    category: 'Custom Software',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “Replaced three disconnected spreadsheets.”',
  },
  {
    id: 'project-5',
    client: 'Client Name Placeholder',
    category: 'UI/UX Design',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “A clearer, more consistent product flow.”',
  },
  {
    id: 'project-6',
    client: 'Client Name Placeholder',
    category: 'Branding',
    description: 'A sample placeholder describing the kind of project shown here.',
    result: 'Placeholder result, e.g. “A cohesive identity across web and social.”',
  },
]

// Testimonials — clearly marked as sample content, not real quotes.
export const testimonials = [
  {
    id: 't1',
    quote:
      'Sample testimonial placeholder. Replace with a real quote from a client once available.',
    name: 'Sample Client Name',
    role: 'Sample Company, Sample Role',
  },
  {
    id: 't2',
    quote:
      'Sample testimonial placeholder. Replace with a real quote from a client once available.',
    name: 'Sample Client Name',
    role: 'Sample Company, Sample Role',
  },
  {
    id: 't3',
    quote:
      'Sample testimonial placeholder. Replace with a real quote from a client once available.',
    name: 'Sample Client Name',
    role: 'Sample Company, Sample Role',
  },
]

// Founders — placeholders only, no invented names or backgrounds.
export const team = [
  {
    id: 'founder-1',
    name: 'Founder Name Placeholder',
    role: 'Co-Founder — Design & Product', // TODO: replace
    bio: 'Short bio placeholder. Add a real background once available.',
  },
  {
    id: 'founder-2',
    name: 'Founder Name Placeholder',
    role: 'Co-Founder — Engineering', // TODO: replace
    bio: 'Short bio placeholder. Add a real background once available.',
  },
]

export const values = [
  {
    id: 'communication',
    title: 'Clear communication',
    description: 'You always know where a project stands and what happens next.',
  },
  {
    id: 'quality',
    title: 'Quality work',
    description: 'We build things properly the first time, not just fast.',
  },
  {
    id: 'practical',
    title: 'Practical solutions',
    description: 'We recommend what your business actually needs, not what is trendy.',
  },
  {
    id: 'support',
    title: 'Long-term support',
    description: 'We stay reachable after launch, not just until the invoice is paid.',
  },
]

export const process = [
  {
    step: 'Discover',
    description: 'We learn about your business, goals, and what success looks like.',
  },
  {
    step: 'Build',
    description: 'We design and develop your site or software, with regular check-ins.',
  },
  {
    step: 'Launch',
    description: 'We ship, test, and stay on hand for support as your business grows.',
  },
]

// Admin dashboard: the inquiry lifecycle statuses, in display order.
export const inquiryStatuses = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export const serviceOptions = services.map((s) => s.title)
export const budgetRanges = [
  'Under $1,000',
  '$1,000 – $3,000',
  '$3,000 – $7,500',
  '$7,500 – $15,000',
  '$15,000+',
  'Not sure yet',
]
