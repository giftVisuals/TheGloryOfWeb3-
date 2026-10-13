import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../hooks/useMediaQuery'

/**
 * A small label that trails the native cursor over project media only.
 * The system cursor is never hidden and the label sits beside the pointer,
 * so it never covers what is being pointed at. Off on touch / reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX + 18)
      y.set(e.clientY + 18)
      const target = (e.target as Element | null)?.closest?.('[data-cursor]')
      setLabel(target?.getAttribute('data-cursor') ?? null)
    }
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', leave)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', leave)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <motion.span
            key="label"
            className="eyebrow block rounded-full bg-paper px-3 py-1.5 text-[0.62rem] text-ink-950 shadow-[0_8px_30px_rgb(0_0_0/0.5)]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
