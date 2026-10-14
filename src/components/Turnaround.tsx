import { Zap } from 'lucide-react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { turnaround } from '../content/site'
import { ease, viewport } from '../motion/tokens'
import { GlassCard } from './ui/GlassCard'

/** Delivery-time cards: dark glass on the light Services chapter, with counting figures. */
export function Turnaround() {
  return (
    <div className="mt-14 md:mt-20">
      <p className="eyebrow mb-5 flex items-center gap-2 text-ink-600/70">
        <Zap className="size-3.5" aria-hidden /> {turnaround.label}
      </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {turnaround.items.map((item, i) => (
          <motion.div
            key={item.service}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: ease.cinema, delay: i * 0.12 }}
          >
            <GlassCard className="h-full rounded-[var(--radius-panel)] bg-ink-950! p-7 text-paper hover:-translate-y-1 md:p-9">
              <p className="flex items-baseline gap-3">
                <span className="text-[clamp(1.5rem,3vw,2.5rem)] font-medium text-smoke">&lt;</span>
                <Counter to={item.hours} className="text-[clamp(4rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums" />
                <span className="text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-tight text-silver">hrs</span>
              </p>
              <p className="mt-6 text-xl font-medium tracking-tight md:text-2xl">{item.service}</p>
              {item.detail && <p className="mt-2 text-sm text-silver">{item.detail}</p>}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.4, ease: ease.cinema, onUpdate: (v) => setValue(v) })
    return () => controls.stop()
  }, [inView, reduce, to])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{to}</span>
      <span aria-hidden>{Math.round(value)}</span>
    </span>
  )
}
