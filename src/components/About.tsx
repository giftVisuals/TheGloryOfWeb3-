import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { about } from '../content/site'
import { asset } from '../lib/media'
import { Reveal } from '../motion/Reveal'
import { clipReveal, viewport } from '../motion/tokens'
import { GlassCard } from './ui/GlassCard'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rule-fade" />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-10 flex items-center gap-3 text-smoke md:mb-14">
            <span className="text-paper">02</span>
            <span aria-hidden className="h-px w-8 bg-white/25" />
            About
          </p>
        </Reveal>

        <h2 id="about-title" className="text-[clamp(2rem,4.6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.04em] text-paper md:max-w-[22ch]">
          <Illuminated text={about.statement} />
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          {about.portrait && (
            <motion.figure variants={clipReveal} initial="hidden" whileInView="visible" viewport={viewport} className="md:col-span-4">
              <img src={asset(about.portrait)} alt={about.portraitAlt || 'Portrait of TheGloryOfWeb3'} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-[var(--radius-frame)] object-cover grayscale" />
            </motion.figure>
          )}

          <Reveal className={about.portrait ? 'md:col-span-4' : 'md:col-span-5 md:col-start-1'}>
            <div className="space-y-5 text-pretty leading-relaxed text-silver">
              {about.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a href="#contact" className="group mt-8 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-sm text-paper transition-colors hover:border-paper">
              Start a conversation
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </Reveal>

          <Reveal className={about.portrait ? 'md:col-span-4' : 'md:col-span-5 md:col-start-8'} delay={0.1}>
            <GlassCard className="rounded-[var(--radius-panel)] p-6 md:p-8">
              <p className="eyebrow mb-3 text-smoke">Focus</p>
              <ul>
                {about.focus.map((item, i) => (
                  <li key={item} className="group/f flex items-baseline justify-between gap-4 border-b border-white/10 py-4 text-paper last:border-0 last:pb-0">
                    <span className="text-lg tracking-tight transition-transform duration-500 ease-(--ease-cinema) group-hover/f:translate-x-1.5">{item}</span>
                    <span className="eyebrow text-smoke transition-colors group-hover/f:text-paper">{String(i + 1).padStart(2, '0')}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Words brighten from graphite to white as the statement scrolls through view. */
function Illuminated({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')

  if (reduce) return <span>{text}</span>
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </span>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}
