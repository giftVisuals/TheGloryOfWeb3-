import type { Transition, Variants } from 'motion/react'

/** One motion vocabulary for the whole site. */
export const ease = {
  /** Long, decelerating — reveals, entrances. */
  cinema: [0.22, 1, 0.36, 1] as const,
  /** Symmetric — state changes, overlays. */
  glide: [0.65, 0, 0.35, 1] as const,
  /** Fast out — exits. */
  out: [0.4, 0, 1, 1] as const,
}

export const duration = {
  quick: 0.25,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
}

export const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

export const transition = (overrides: Transition = {}): Transition => ({
  duration: duration.base,
  ease: ease.cinema,
  ...overrides,
})

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: transition({ duration: duration.slow }) },
}

/** Line / word mask: the child slides up from behind an overflow-hidden parent. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: transition({ duration: duration.reveal }) },
}

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(12% 6% 12% 6% round 18px)', opacity: 0 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0% round 18px)',
    opacity: 1,
    transition: { duration: duration.reveal, ease: ease.cinema },
  },
}

export const stagger = (each = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren } },
})
