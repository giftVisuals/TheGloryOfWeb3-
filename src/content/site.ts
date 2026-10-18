import type { ContactLink, Faq, Package, ProcessStep, Service, Testimonial, Turnaround } from '../types'

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
  backgroundVideo: 'media/showreel-loop.mp4',
  /** Optional WebM copy of the reel; browsers pick the format they support. */
  backgroundVideoWebm: 'media/showreel-loop.webm',
  backgroundPoster: 'media/showreel-poster.jpg',
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
    turnaround: 'Under 2 hrs',
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
  {
    title: 'AI UGC',
    description: 'Ultra-realistic AI creator videos — scripted, generated, voiced and edited to feel native to TikTok, Reels and Shorts, at a fraction of a shoot.',
    turnaround: 'Under 4 hrs',
  },
]

/** Delivery times, shown as large animated figures in the Services section. */
export const turnaround = {
  label: 'Turnaround',
  items: [
    { hours: 2, service: 'Motion design', detail: 'From brief to delivered file.' },
    { hours: 4, service: 'Ultra-realistic AI UGC + motion design', detail: 'AI creator, voice, edit and motion — delivered.' },
  ] as Turnaround[],
}

/**
 * "Ways to work together". Edit names, lengths and inclusions freely.
 * Prices are intentionally not shown — set `pricing` to e.g. "From $500".
 */
export const packages = {
  pricing: 'Rates on request — message me with your brief.',
  items: [
    {
      name: 'Launch Film',
      bestFor: 'Product launches and big announcements',
      length: '30–60s',
      turnaround: 'Under 2 hrs',
      includes: ['Cinematic kinetic type and UI motion', '3D elements where they add impact', 'Voiceover, music and sound design', '16:9 master plus a 9:16 cut'],
    },
    {
      name: 'Feature Explainer',
      bestFor: 'New features and how-it-works',
      length: '20–45s',
      turnaround: 'Under 2 hrs',
      includes: ['Step-by-step story that lands in one watch', 'Animated walkthrough of your real UI', 'Captions built for silent autoplay', 'Vertical-first for X and TikTok'],
    },
    {
      name: 'AI UGC Ad',
      bestFor: 'Social ads that feel native',
      length: '15–60s',
      turnaround: 'Under 4 hrs',
      includes: ['Ultra-realistic AI creator', 'Voice and talking performance', 'Hook-first edit with motion graphics', 'Vertical and landscape versions'],
    },
    {
      name: 'Content Retainer',
      bestFor: 'Teams shipping every week',
      length: 'Monthly',
      turnaround: 'Planned around your roadmap',
      includes: ['A set number of videos each month', 'Reserved slots in my schedule', 'One consistent visual system', 'Mix of films, explainers and AI UGC'],
    },
  ] as Package[],
}

/** Frequently asked questions. Answers marked CONFIRM should be checked by you. */
export const faq: Faq[] = [
  {
    q: 'How fast can you deliver?',
    a: 'Motion design is delivered in under 2 hours, and ultra-realistic AI UGC with motion design in under 4 hours, once the brief and assets are in.',
  },
  {
    q: 'What do you need from me to start?',
    a: 'A link to your product or screen recordings of the flow you want shown, your brand kit (logo, colours, fonts), the key message or script, and one or two videos you like the feel of.',
  },
  {
    q: 'Do you handle voiceover, music and sound design?',
    a: 'Yes. Voiceover, music, sound effects and the full sound mix can all be included, so you receive a finished, ready-to-post video.',
  },
  {
    q: 'Which formats do you deliver?',
    a: 'Landscape 16:9 for X, YouTube and your site, and vertical 9:16 for TikTok, Reels and Shorts, exported as high-quality MP4 files.',
  },
  {
    // CONFIRM: your revision policy.
    q: 'Are revisions included?',
    a: 'Yes. Revisions are agreed before we start so the scope is clear on both sides.',
  },
  {
    // CONFIRM: payment methods (e.g. USDC, SOL, bank transfer) and terms.
    q: 'How does payment work?',
    a: 'Payment terms and methods are agreed upfront for each project. Message me on Telegram for details.',
  },
  {
    // CONFIRM: your confidentiality policy.
    q: 'Can you keep an unreleased product confidential?',
    a: 'Yes. Work stays private until you launch, and nothing appears in my portfolio without your approval.',
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
  /** Main call to action across the site (hero, contact, sticky mobile button). */
  primary: { label: 'Message me on Telegram', short: 'Start a project', url: 'https://t.me/TheGlory0fweb3' },
  /** Your public business email, e.g. "hello@yourdomain.com". Empty = hidden. */
  email: 'Aweglory388@gmail.com',
  /** Only real, working profiles. Shown in the contact section and footer. */
  links: [
    { label: 'X', url: 'https://x.com/TheGloryofweb3', handle: '@TheGloryofweb3' },
    { label: 'Telegram', url: 'https://t.me/TheGlory0fweb3', handle: '@TheGlory0fweb3' },
    // Discord usernames have no public profile URL, so this one copies the username.
    { label: 'Discord', handle: 'thegloryofweb3' },
  ] as ContactLink[],
}
