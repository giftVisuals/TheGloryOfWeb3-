import { ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { identity } from '../content/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { cn } from '../lib/cn'
import { ease } from '../motion/tokens'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'packages', label: 'Packages' },
  { id: 'contact', label: 'Contact' },
]
const IDS = LINKS.map((l) => l.id)

/** Glass panel that grows out of the menu button: scale + circular clip + de-blur. */
const panel: Variants = {
  closed: {
    opacity: 0,
    scale: 0.6,
    filter: 'blur(10px)',
    clipPath: 'circle(0% at 100% 0%)',
    transition: { duration: 0.35, ease: ease.out, when: 'afterChildren', staggerChildren: 0.03, staggerDirection: -1 },
  },
  open: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    clipPath: 'circle(150% at 100% 0%)',
    transition: { type: 'spring', stiffness: 260, damping: 26, staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

const item: Variants = {
  closed: { opacity: 0, x: 18, filter: 'blur(6px)', transition: { duration: 0.2 } },
  open: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

const reducedPanel: Variants = { closed: { opacity: 0 }, open: { opacity: 1 } }
const reducedItem: Variants = { closed: { opacity: 1 }, open: { opacity: 1 } }

export function Nav() {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(IDS)
  const menuRoot = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 48))

  // Dropdown behaviour: close on outside press, Escape, focus leaving, or growing to desktop.
  useEffect(() => {
    if (!open) return
    const inside = (t: EventTarget | null) => Boolean(menuRoot.current?.contains(t as Node) || panelRef.current?.contains(t as Node))
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onFocus = (e: FocusEvent) => {
      if (!inside(e.target)) setOpen(false)
    }
    const mql = window.matchMedia('(min-width: 768px)')
    const onWide = () => mql.matches && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    mql.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
      mql.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0.3 } : { duration: 0.8, delay: 0.9, ease: ease.cinema }}
    >
      <nav
        aria-label="Primary"
        className={cn(
          'relative flex h-14 w-full items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,border-color,max-width,box-shadow,backdrop-filter] duration-700 ease-(--ease-cinema)',
          scrolled || open ? 'glass glass-sheen max-w-3xl bg-ink-900/80!' : 'max-w-[108rem] border-transparent bg-transparent shadow-none',
        )}
      >
        <a href="#top" className="text-sm font-semibold tracking-tight text-paper" aria-label={`${identity.name} — back to top`}>
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
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full bg-paper px-5 py-2.5 text-[0.8rem] font-medium text-ink-950 transition-transform duration-300 hover:scale-[1.04] md:block"
        >
          Start a project
        </a>

        {/* Mobile: compact glass dropdown anchored to the button. */}
        <div ref={menuRoot} className="md:hidden">
          <button
            ref={toggle}
            type="button"
            className="relative flex h-10 items-center gap-3 rounded-full px-4 text-[0.8rem] text-paper"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="eyebrow relative block h-[1em] w-[4em] overflow-hidden text-right" aria-hidden>
              <motion.span className="absolute inset-0" animate={{ y: open ? '-110%' : '0%' }} transition={{ duration: 0.4, ease: ease.cinema }}>
                Menu
              </motion.span>
              <motion.span className="absolute inset-0" initial={false} animate={{ y: open ? '0%' : '110%' }} transition={{ duration: 0.4, ease: ease.cinema }}>
                Close
              </motion.span>
            </span>
            <span aria-hidden className="relative block h-2.5 w-5">
              <span className={cn('absolute left-0 h-px w-full bg-current transition-all duration-500 ease-(--ease-cinema)', open ? 'top-1/2 rotate-45' : 'top-0')} />
              <span className={cn('absolute right-0 h-px bg-current transition-all duration-500 ease-(--ease-cinema)', open ? 'top-1/2 w-full -rotate-45' : 'top-full w-3/5')} />
            </span>
          </button>

        </div>
      </nav>

      {/* Outside the nav bar so its backdrop blur frosts the page, not just the bar. */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              className="glass glass-sheen absolute right-3 top-[calc(0.75rem+3.5rem+0.6rem)] w-64 origin-top-right overflow-hidden rounded-[1.25rem] bg-ink-900/55! p-2 sm:right-4 sm:top-[calc(1rem+3.5rem+0.6rem)] md:hidden"
              variants={reduce ? reducedPanel : panel}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Soft light that drifts inside the glass. */}
              <span aria-hidden className="animate-drift pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.14),transparent)]" />
              <ul className="relative">
                {LINKS.map((link, i) => (
                  <motion.li key={link.id} variants={reduce ? reducedItem : item}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? 'true' : undefined}
                      className={cn(
                        'group flex items-center justify-between rounded-xl px-4 py-3 text-lg font-medium tracking-tight transition-colors duration-300',
                        active === link.id ? 'bg-white/[0.08] text-paper' : 'text-fog hover:bg-white/[0.06] hover:text-paper',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="eyebrow text-smoke">0{i + 1}</span>
                        {link.label}
                      </span>
                      <ArrowUpRight
                        className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-aria-[current]:translate-x-0 group-aria-[current]:opacity-60"
                        aria-hidden
                      />
                    </a>
                  </motion.li>
                ))}
                <motion.li variants={reduce ? reducedItem : item} className="mt-2 border-t border-white/10 pt-2">
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-paper px-4 py-3 text-sm font-medium text-ink-950 transition-transform active:scale-[0.98]"
                  >
                    Start a project <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.header>
  )
}
