import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { process } from '../content/site'
import { ease, viewport } from '../motion/tokens'
import { SectionHeading } from './SectionHeading'
import { GlassCard } from './ui/GlassCard'

export function Process() {
  const track = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]" />
      <div className="container-x relative">
        <SectionHeading index="05" label="Process" title="From brief to final export." id="process-title" />

        <div className="relative mt-16 md:mt-24">
        <div aria-hidden className="absolute left-0 right-0 top-0 hidden h-px bg-white/10 md:block">
          <motion.div className="h-full origin-left bg-paper" style={{ scaleX: reduce ? 1 : progress }} />
        </div>
        <ol ref={track} className="grid gap-12 md:grid-cols-4 md:gap-8">
          {process.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative md:pt-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: ease.cinema, delay: i * 0.12 }}
            >
              <span aria-hidden className="absolute -top-[2px] left-0 hidden size-[5px] rounded-full bg-paper md:block" />
              <GlassCard className="h-full rounded-[var(--radius-panel)] p-6 hover:-translate-y-1.5 hover:border-white/15 md:p-7">
              <span className="block text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.35)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 text-xl font-medium tracking-tight text-paper">{step.title}</h3>
              <p className="mt-3 max-w-[30ch] text-pretty leading-relaxed text-silver">{step.description}</p>
              </GlassCard>
            </motion.li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}
