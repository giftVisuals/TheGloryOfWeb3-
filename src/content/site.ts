import type { ContactLink, ProcessStep, Service, Testimonial } from '../types'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — every piece of copy outside the project library.
 * ─────────────────────────────────────────────────────────────────────────
 *  All copy here is editable starting direction. Nothing in this file is a
 *  claim about clients, results or endorsements.
 */

export const identity = {
  name: 'TheGloryOfWeb3',
  /** How the oversized hero wordmark is split across two lines. */
  wordmarkLines: ['TheGlory', 'OfWeb3'] as const,
  roles: ['Video Editor', 'Motion Designer', 'Visual Storyteller'],
}

export const hero = {
  statement: 'Crafting cinematic visuals and motion-driven stories for the decentralized future.',
  /**
   * Optional background reel — a short, muted, looping DIRECT video file
   * (e.g. "media/reel-loop.mp4", ideally < 6 MB, 1080p, no audio).
   * Google Drive links cannot be used here. Leave empty to keep the
   * generated light composition.
   */
  backgroundVideo: '',
  backgroundPoster: '',
}

export const about = {
  statement:
    'I turn ideas into visual experiences through precise editing, intentional motion, and cinematic storytelling.',
  bio: [
    'TheGloryOfWeb3 is a video editor and motion designer working at the intersection of technology and story — shaping launches, explainers and brand pieces for Web3, crypto and the products built around them.',
    'Every edit starts with rhythm: what the audience needs to feel, when, and for how long. Motion is used to clarify, never to decorate.',
  ],
  focus: ['Web3 & crypto narratives', 'Motion graphics & kinetic type', 'Cinematic pacing & sound', 'Short-form for social'],
  /** Optional portrait. Path inside /public or a URL. Leave empty to omit. */
  portrait: '',
  portraitAlt: '',
}

/** Remove, reorder or add services freely. No pricing is shown. */
export const services: Service[] = [
  {
    title: 'Video Editing',
    description: 'Story-first edits with deliberate pacing, clean cuts, colour balance and sound that carries the picture.',
  },
  {
    title: 'Motion Graphics',
    description: 'Kinetic typography, animated interfaces and graphic systems that explain and elevate without noise.',
  },
  {
    title: 'Web3 & Crypto Content',
    description: 'Launch films, protocol explainers and announcement videos that make complex technology feel clear and credible.',
  },
  {
    title: 'Promotional Videos',
    description: 'Campaign and marketing pieces built around a single, memorable idea and cut for every placement.',
  },
  {
    title: 'Explainer Videos',
    description: 'Structured narratives that turn products, features and mechanisms into something an audience understands in seconds.',
  },
  {
    title: 'Social Media Editing',
    description: 'Vertical and square cuts engineered for the first three seconds — captions, hooks and rhythm included.',
  },
]

export const process: ProcessStep[] = [
  { title: 'Discovery', description: 'Understand the concept, audience, objective and creative direction.' },
  { title: 'Structure', description: 'Develop the narrative, pacing and visual approach.' },
  { title: 'Edit & Animate', description: 'Build the edit, transitions, motion graphics, sound design and finishing.' },
  { title: 'Refine & Deliver', description: 'Review the result, make agreed revisions and prepare final exports.' },
]

/**
 * Credibility section. Stays hidden until `enabled` is true AND there is
 * real, approved content. Never add invented quotes, logos or awards.
 */
export const credibility = {
  enabled: false,
  testimonials: [] as Testimonial[],
  /** Names of collaborators / clients approved for public display. */
  collaborators: [] as string[],
}

export const contact = {
  heading: 'Have a story worth bringing to life?',
  /** Your public business email, e.g. "hello@yourdomain.com". Empty = hidden. */
  email: '',
  /** Only real, working profiles. Shown in the contact section and footer. */
  links: [
    // { label: 'X', url: 'https://x.com/yourhandle', handle: '@yourhandle' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yourprofile' },
  ] as ContactLink[],
}
