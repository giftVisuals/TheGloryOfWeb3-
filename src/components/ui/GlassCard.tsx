import { useReducedMotion } from 'motion/react'
import { useRef, type HTMLAttributes, type PointerEvent } from 'react'
import { cn } from '../../lib/cn'

/**
 * Glass panel with a pointer-following spotlight and rim light.
 * Writes CSS variables directly (no React re-render per pointer move).
 */
export function GlassCard({ className, children, onPointerMove, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={move} className={cn('glass-spot', className)} {...rest}>
      {children}
    </div>
  )
}
