import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'

/** Restrained 3D depth for media frames: a few degrees of tilt plus a moving glare. */
export function Tilt({ children, max = 3, className }: { children: ReactNode; max?: number; className?: string }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 20, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const glareX = useTransform(px, [0, 1], ['0%', '100%'])
  const glareY = useTransform(py, [0, 1], ['0%', '100%'])
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgb(255 255 255 / 0.10), transparent 45%)`)

  if (!fine || reduce) return <span className={className ?? 'block'}>{children}</span>

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <span className={className ?? 'block'} style={{ perspective: 1200 }} onPointerMove={move} onPointerLeave={reset}>
      <motion.span className="relative block size-full" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-frame)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundImage: glare }}
        />
      </motion.span>
    </span>
  )
}
