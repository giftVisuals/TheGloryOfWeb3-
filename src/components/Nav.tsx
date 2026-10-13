import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { identity } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { cn } from '../lib/cn'
import { ease } from '../motion/tokens'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]
const IDS = LINKS.map((l) => l.id)

export function Nav() {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(IDS)
  const drawer = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 48))
  useScrollLock(open)
  useFocusTrap(drawer, open, close)

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0.3 } : { duration: 0.8, delay: 0.9, ease: ease.cinema }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'flex h-14 w-full items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,border-color,max-width,box-shadow,backdrop-filter] duration-700 ease-(--ease-cinema)',
            scrolled
              ? 'glass max-w-3xl bg-ink-900/80!'
              : 'max-w-[108rem] border-transparent bg-transparent shadow-none',
          )}
        >
          <a href="#top" className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-paper" aria-label={`${identity.name} — back to top`}>
            <span aria-hidden className="relative block size-2 rounded-full bg-paper transition-transform duration-500 group-hover:scale-150" />
            {identity.name}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={cn(
                    'relative block rounded-full px-4 py-2 text-[0.8rem] tracking-wide transition-colors duration-300',
                    active === link.id ? 'text-paper' : 'text-silver hover:text-paper',
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                      transition={{ duration: 0.5, ease: ease.cinema }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden rounded-full bg-paper px-5 py-2.5 text-[0.8rem] font-medium text-ink-950 transition-transform duration-300 hover:scale-[1.03] md:block"
          >
            Start a project
          </a>

          <button
            type="button"
            className="relative flex h-10 items-center gap-3 rounded-full px-4 text-[0.8rem] text-paper md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="eyebrow">{open ? 'Close' : 'Menu'}</span>
            <span aria-hidden className="relative block h-2.5 w-5">
              <span className={cn('absolute left-0 h-px w-full bg-current transition-all duration-500 ease-(--ease-cinema)', open ? 'top-1/2 rotate-45' : 'top-0')} />
              <span className={cn('absolute left-0 h-px w-full bg-current transition-all duration-500 ease-(--ease-cinema)', open ? 'top-1/2 -rotate-45' : 'top-full')} />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawer}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/96 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: ease.glide }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-2">
              {LINKS.map((link, i) => (
                <li key={link.id} className="overflow-hidden border-b border-white/[0.07]">
                  <motion.a
                    href={`#${link.id}`}
                    onClick={close}
                    className="flex items-baseline justify-between py-4 text-5xl font-semibold tracking-[-0.04em] text-paper"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: ease.cinema }}
                  >
                    {link.label}
                    <span className="eyebrow text-smoke">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-smoke">{identity.roles.join(' · ')}</p>
              <button type="button" onClick={close} className="eyebrow rounded-full border border-white/15 px-4 py-2.5 text-paper">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
