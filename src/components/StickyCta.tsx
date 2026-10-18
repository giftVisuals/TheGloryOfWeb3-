import { Send } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { contact } from '../content/site'
import { ease } from '../motion/tokens'

/**
 * Phones only: a glass "Start a project" pill that appears once the hero has
 * scrolled away and hides again while the contact section is on screen.
 */
export function StickyCta() {
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setPastHero(y > window.innerHeight * 0.85))

  useEffect(() => {
    const el = document.getElementById('contact')
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {pastHero && !atContact && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: ease.cinema }}
        >
          <a
            href={contact.primary.url}
            target="_blank"
            rel="noreferrer"
            className="glass glass-sheen pointer-events-auto relative inline-flex h-12 items-center gap-2.5 rounded-full bg-ink-900/70! pl-5 pr-1.5 text-sm font-medium text-paper"
          >
            <Send className="size-4" aria-hidden />
            {contact.primary.short}
            <span className="rounded-full bg-paper px-3 py-1.5 text-xs text-ink-950">Telegram</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
