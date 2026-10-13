import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp, maskUp, stagger, viewport } from './tokens'

interface RevealProps {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span'
}

/** Viewport-triggered entrance. Use for blocks, not individual sentences. */
export function Reveal({ children, className, variants = fadeUp, delay = 0, as = 'div' }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  )
}

interface MaskedTextProps {
  text: string
  className?: string
  /** Split by words (default) or treat each "\n" separated line as a unit. */
  by?: 'word' | 'line'
  delay?: number
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean
}

/**
 * Masked word/line reveal for headings. The full string is exposed to
 * assistive tech once (visually hidden); the animated fragments are hidden from it.
 */
export function MaskedText({ text, className, by = 'word', delay = 0, immediate = false }: MaskedTextProps) {
  const parts = by === 'line' ? text.split('\n') : text.split(' ')
  return (
    <motion.span
      className={className}
      variants={stagger(by === 'line' ? 0.12 : 0.05, delay)}
      initial="hidden"
      {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport })}
    >
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      {parts.map((part, i) => (
        <span key={i} aria-hidden className={by === 'line' ? 'block overflow-hidden pb-[0.08em]' : 'inline-block overflow-hidden pb-[0.1em] align-top'}>
          <motion.span className="inline-block will-change-transform" variants={maskUp}>
            {part}
            {by === 'word' && i < parts.length - 1 ? ' ' : null}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
