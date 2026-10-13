import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { hero, identity } from '../content/site'
import { asset, prefersLightMedia } from '../lib/media'
import { ease } from '../motion/tokens'
import { Magnetic } from './ui/Magnetic'

/** Entrance timing; collapses to a short, undelayed fade under reduced motion. */
function useEnter() {
  const reduce = useReducedMotion()
  return (delay: number, duration: number) => (reduce ? { duration: 0.3, delay: 0 } : { duration, delay, ease: ease.cinema })
}

/**
 * Entrance sequence (≈1.8s, never blocks scrolling or clicks):
 *  1. black canvas → 2. atmospheric light → 3. masked wordmark →
 *  4. supporting type → 5. background media → 6. scroll cue.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const enter = useEnter()
  const section = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0])

  return (
    <section ref={section} id="top" aria-label="Introduction" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <Atmosphere />

      <motion.div style={{ opacity: fade }} className="container-x relative flex flex-1 flex-col pb-8 pt-28 sm:pb-10 md:pt-32">
        <motion.div
          className="flex items-start justify-between gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={enter(1.1, 1)}
        >
          <p className="eyebrow max-w-[14rem] text-silver">Portfolio — Selected edits &amp; motion work</p>
          <Timecode />
        </motion.div>

        <div className="mt-auto">
          <motion.h1 style={{ y: wordmarkY }} className="text-display select-none text-[clamp(3.4rem,17.2vw,18.5rem)] text-paper uppercase">
            <span className="sr-only">{identity.name}</span>
            {identity.wordmarkLines.map((line, li) => (
              <span key={line} aria-hidden className={`block overflow-hidden pb-[0.04em] ${li === 1 ? 'text-right' : ''}`}>
                {[...line].map((char, ci) => (
                  <motion.span
                    key={ci}
                    className="inline-block will-change-transform"
                    initial={{ y: '105%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={enter(0.35 + li * 0.18 + ci * 0.035, 1.2)}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <div className="mt-8 grid gap-8 border-t border-white/10 pt-6 md:mt-10 md:grid-cols-12 md:items-end">
            <motion.ul
              className="eyebrow flex flex-wrap gap-x-5 gap-y-1.5 text-fog md:col-span-3 md:flex-col"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.95 } } }}
            >
              {identity.roles.map((role) => (
                <motion.li
                  key={role}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: enter(0, 0.8) } }}
                >
                  {role}
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              className="max-w-md text-balance text-lg leading-snug text-silver md:col-span-5 md:text-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(1.1, 0.9)}
            >
              {hero.statement}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(1.25, 0.9)}
            >
              <Magnetic>
              <a
                href="#work"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-paper pl-6 pr-2 text-sm font-medium text-ink-950 transition-transform duration-300 hover:scale-[1.02]"
              >
                Explore my work
                <span className="grid size-8 place-items-center rounded-full bg-ink-950 text-paper transition-transform duration-500 ease-(--ease-cinema) group-hover:translate-y-0.5">
                  <ArrowDown className="size-4" aria-hidden />
                </span>
              </a>
              </Magnetic>
              <Magnetic>
              <a
                href="#contact"
                className="glass glass-sheen group relative inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm text-paper transition-colors duration-300 hover:border-white/30"
              >
                Get in touch
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-cinema) group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.a
        href="#work"
        aria-label="Scroll to selected work"
        className="absolute right-[calc(var(--gutter)/2-0.4rem)] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-smoke transition-colors hover:text-paper lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={enter(1.7, 1)}
      >
        <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <span className="animate-cue absolute inset-x-0 top-0 h-1/2 bg-paper" />
        </span>
      </motion.a>
    </section>
  )
}

/** Monochrome light composition; optional muted reel layered on top. */
function Atmosphere() {
  const reduce = useReducedMotion()
  const enter = useEnter()
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const useVideo = Boolean(hero.backgroundVideo) && !videoFailed
  const allowPlayback = !reduce && !prefersLightMedia()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={enter(0, 2.2)}>
        <div className="animate-drift absolute -left-[20%] -top-[30%] h-[110%] w-[90%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.11),transparent)]" />
        <div className="animate-drift-slow absolute -right-[25%] top-[20%] h-[90%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(200_200_200/0.07),transparent)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-sweep absolute -top-1/2 left-0 h-[200%] w-[18%] bg-gradient-to-r from-transparent via-white/[0.035] to-transparent" />
        </div>
      </motion.div>

      {useVideo && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady || !allowPlayback ? 0.55 : 0 }}
          transition={enter(0.6, 1.6)}
        >
          {allowPlayback ? (
            <video
              className="size-full object-cover"
              src={asset(hero.backgroundVideo)}
              poster={hero.backgroundPoster ? asset(hero.backgroundPoster) : undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlaying={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            />
          ) : hero.backgroundPoster ? (
            <img className="size-full object-cover" src={asset(hero.backgroundPoster)} alt="" />
          ) : null}
        </motion.div>
      )}

      {/* Vignette + floor so type stays legible over any footage. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(4_4_4/0.85))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent" />
      <FrameGuides />
      <GlassOrbs />
    </div>
  )
}

function FrameGuides() {
  const enter = useEnter()
  const corner = 'absolute size-5 border-white/20'
  return (
    <motion.div className="absolute inset-x-[var(--gutter)] top-24 hidden h-6 md:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={enter(1.3, 1.4)}>
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
    </motion.div>
  )
}

/** A running SMPTE-style timecode — a quiet nod to the edit suite. */
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const start = performance.now()
    let frame = 0
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const f = Math.floor((t % 1) * 24)
      const s = Math.floor(t) % 60
      const m = Math.floor(t / 60) % 60
      const h = Math.floor(t / 3600)
      if (ref.current) ref.current.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce])

  return (
    <p aria-hidden className="glass eyebrow hidden items-center gap-3 rounded-full px-4 py-2 text-silver tabular-nums sm:flex">
      <span className="relative size-1.5 rounded-full bg-paper/80"><span className="absolute inset-0 animate-ping rounded-full bg-paper/50 motion-reduce:hidden" /></span>
      <span ref={ref}>00:00:00:00</span>
      <span className="text-smoke">24 fps</span>
    </p>
  )
}

/** Two small frosted discs drifting behind the type — glass catching the light. Desktop only. */
function GlassOrbs() {
  const enter = useEnter()
  const orb = 'absolute rounded-full border border-white/10 bg-white/[0.03] shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_30px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md'
  return (
    <motion.div className="absolute inset-0 hidden lg:block" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={enter(1.2, 1.6)}>
      <div className={`${orb} animate-float right-[14%] top-[18%] size-40 bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.16),transparent_60%)]`} />
      <div className={`${orb} animate-float-slow left-[42%] top-[12%] size-20 bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.14),transparent_60%)]`} />
    </motion.div>
  )
}
