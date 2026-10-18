import { ArrowDown, Send } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue, type Transition } from 'motion/react'
import { useRef, useState } from 'react'
import { contact, hero, identity } from '../content/site'
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
  // A soft spring makes the scroll-out trail the scrollbar, so it reads slow and cinematic.
  const progress = useSpring(scrollYProgress, { stiffness: 45, damping: 20, mass: 0.8 })
  const wordmarkY = useTransform(progress, [0, 1], ['0%', reduce ? '0%' : '10%'])
  const zoom = useTransform(progress, [0, 1], [1, reduce ? 1 : 0.92])
  const fade = useTransform(progress, [0, 0.95], [1, reduce ? 1 : 0])

  return (
    <section ref={section} id="top" aria-label="Introduction" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <Atmosphere progress={progress} />

      <motion.div style={{ opacity: fade }} className="container-x relative flex flex-1 flex-col pb-8 pt-28 sm:pb-10 md:pt-32">
        <motion.div
          className="flex items-start justify-between gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={enter(1.1, 1)}
        >
          <p className="eyebrow max-w-[14rem] text-silver">Portfolio — Selected edits &amp; motion work</p>
        </motion.div>

        <div className="mt-auto">
          <motion.h1 style={{ y: wordmarkY, scale: zoom }} className="text-display origin-bottom-left select-none text-[clamp(3.4rem,min(17.2vw,27svh),18.5rem)] text-paper uppercase">
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
                href={contact.primary.url}
                target="_blank"
                rel="noreferrer"
                className="glass glass-sheen group relative inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-sm text-paper transition-colors duration-300 hover:border-white/30"
              >
                <Send className="size-4 transition-transform duration-500 ease-(--ease-cinema) group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                Message on Telegram
                <span className="sr-only">(opens Telegram)</span>
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
function Atmosphere({ progress }: { progress: MotionValue<number> }) {
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
          animate={{ opacity: videoReady || !allowPlayback ? 0.34 : 0 }}
          transition={enter(0.6, 1.6)}
        >
          {allowPlayback ? (
            <video
              // Soft focus keeps the reel as atmosphere so the name stays the hero.
              className="size-full scale-105 object-cover blur-[3px] md:blur-[2px]"
              poster={hero.backgroundPoster ? asset(hero.backgroundPoster) : undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlaying={() => setVideoReady(true)}
            >
              {hero.backgroundVideoWebm && <source src={asset(hero.backgroundVideoWebm)} type="video/webm" />}
              <source src={asset(hero.backgroundVideo)} type="video/mp4" onError={() => setVideoFailed(true)} />
            </video>
          ) : hero.backgroundPoster ? (
            <img className="size-full scale-105 object-cover blur-[3px] md:blur-[2px]" src={asset(hero.backgroundPoster)} alt="" />
          ) : null}
        </motion.div>
      )}

      {/* Vignette + floor so type stays legible over any footage. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(4_4_4/0.85))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent" />
      <FrameGuides />
      <GlassOrbs progress={progress} />
    </div>
  )
}

function FrameGuides() {
  const enter = useEnter()
  const corner = 'absolute size-5 border-white/20'
  return (
    <motion.div className="absolute inset-x-0 top-24 hidden md:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={enter(1.3, 1.4)}>
      <div className="container-x">
        <div className="relative h-6">
          <span className={`${corner} left-0 top-0 border-l border-t`} />
          <span className={`${corner} right-0 top-0 border-r border-t`} />
        </div>
      </div>
    </motion.div>
  )
}

/** A drift of dark glass spheres at different depths. Each one floats on its own
 *  cycle and slides at its own speed as you scroll, which gives the hero real depth. */
const ORBS = [
  // size, position, scroll travel (px), depth blur, float timing, visibility
  { size: 'size-28 md:size-44', pos: 'right-[6%] top-[16%] md:right-[13%] md:top-[15%]', travel: -160, blur: '', float: 'animate-float', show: '' },
  { size: 'size-14 md:size-20', pos: 'left-[58%] top-[30%] md:left-[44%] md:top-[11%]', travel: -90, blur: '', float: 'animate-float-slow', show: '' },
  { size: 'size-10 md:size-14', pos: 'left-[6%] top-[46%] md:left-[7%] md:top-[56%]', travel: -40, blur: 'blur-[2px] opacity-70', float: 'animate-float', show: '' },
  { size: 'size-28', pos: 'right-[30%] bottom-[24%]', travel: -220, blur: '', float: 'animate-float-slow', show: 'hidden lg:block' },
  { size: 'size-9', pos: 'left-[64%] top-[40%]', travel: -120, blur: 'blur-[1px] opacity-80', float: 'animate-float', show: 'hidden md:block' },
  { size: 'size-16', pos: 'right-[3%] top-[58%]', travel: -60, blur: 'blur-[3px] opacity-60', float: 'animate-float-slow', show: 'hidden md:block' },
  { size: 'size-6', pos: 'left-[24%] top-[20%]', travel: -30, blur: 'blur-[2px] opacity-50', float: 'animate-float', show: 'hidden lg:block' },
] as const

function GlassOrbs({ progress }: { progress: MotionValue<number> }) {
  const enter = useEnter()
  return (
    <div className="absolute inset-0">
      {ORBS.map((orb, i) => (
        <Orb key={i} {...orb} progress={progress} transition={enter(1 + i * 0.12, 1.6)} delay={i * -1.7} />
      ))}
    </div>
  )
}

function Orb({
  size,
  pos,
  travel,
  blur,
  float,
  show,
  progress,
  transition,
  delay,
}: (typeof ORBS)[number] & { progress: MotionValue<number>; transition: Transition; delay: number }) {
  const reduce = useReducedMotion()
  const y = useTransform(progress, [0, 1], [0, reduce ? 0 : travel])
  return (
    <motion.div className={`absolute ${pos} ${show}`} style={{ y }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={transition}>
      <div
        className={`relative ${size} ${blur} ${float} rounded-full border border-white/[0.08] bg-[radial-gradient(circle_at_32%_26%,#3c3c3c,#151515_42%,#060606_72%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-12px_24px_rgb(0_0_0/0.6),0_30px_60px_-20px_rgb(0_0_0/0.9)]`}
        style={{ animationDelay: `${delay}s` }}
      >
        {/* Specular highlight — the "glass" catching the light. */}
        <span className="absolute left-[22%] top-[16%] h-[18%] w-[28%] rotate-[-25deg] rounded-full bg-white/[0.14] blur-[2px]" />
      </div>
    </motion.div>
  )
}
