import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'

/** Gently pulls its child toward the cursor (mouse only, off under reduced motion). */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })
  const enabled = fine && !reduce

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span className={className ?? 'inline-block'} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}
