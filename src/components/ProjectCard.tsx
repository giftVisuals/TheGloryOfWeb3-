import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type CSSProperties, type PointerEvent } from 'react'
import type { Project } from '../types'
import { cn } from '../lib/cn'
import { categories, ratio } from '../lib/media'
import { clipReveal, ease, fadeUp, viewport } from '../motion/tokens'
import { ProjectMedia } from './ProjectMedia'
import { Tilt } from './ui/Tilt'

type Variant = 'featured' | 'tile' | 'split'

interface ProjectCardProps {
  project: Project
  index: number
  total: number
  variant: Variant
  onOpen: (id: string) => void
  sizes?: string
  className?: string
  style?: CSSProperties
}

const pad = (n: number) => String(n).padStart(2, '0')

export function ProjectCard({ project, index, total, variant, onOpen, sizes, className, style }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const aspect = ratio(project.aspectRatio)
  const meta = [...categories(project), project.year].filter(Boolean).join(' · ')

  const media = (
    <Tilt className="absolute inset-0 block" max={variant === 'featured' ? 1.5 : 3}>
      <ProjectMedia
        project={project}
        hovered={hovered}
        sizes={sizes}
        priority={variant === 'featured'}
        className="size-full rounded-[var(--radius-frame)] shadow-frame"
      />
    </Tilt>
  )

  const indicator = (
    <span className="glass pointer-events-none absolute bottom-4 right-4 flex translate-y-2 items-center gap-2 rounded-full py-2 pl-4 pr-2 text-xs text-paper opacity-0 transition-all duration-500 ease-(--ease-cinema) group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
      View project
      <span className="grid size-6 place-items-center rounded-full bg-paper text-ink-950">
        <ArrowUpRight className="size-3.5" aria-hidden />
      </span>
    </span>
  )

  const caption = (
    <span className="mt-5 flex items-start justify-between gap-6">
      <span className="block min-w-0">
        <span className="eyebrow mb-2 block text-smoke">
          {pad(index + 1)} / {pad(total)} — {meta}
        </span>
        <span className="block text-2xl font-medium tracking-[-0.03em] text-paper transition-transform duration-700 ease-(--ease-cinema) group-hover:translate-x-1.5 md:text-3xl">
          {project.title}
        </span>
        <span className="mt-1.5 block text-sm text-silver">
          {project.client ? `${project.client} — ` : ''}
          {project.role}
        </span>
      </span>
      {project.sample && <SampleBadge />}
    </span>
  )

  const buttonProps = {
    type: 'button' as const,
    onClick: () => onOpen(project.id),
    onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    'data-cursor': 'Play',
    'aria-label': `Open project: ${project.title}${project.sample ? ' (sample slot)' : ''}`,
    className: 'group block w-full text-left rounded-[var(--radius-frame)]',
  }

  if (variant === 'featured') {
    return (
      <motion.article className={className} style={style} variants={clipReveal} initial="hidden" whileInView="visible" viewport={viewport}>
        <button {...buttonProps}>
          <span className="relative block" style={{ aspectRatio: aspect }}>
            {media}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/2 rounded-b-[var(--radius-frame)] bg-gradient-to-t from-ink-950/85 to-transparent md:block" />
            <span className="pointer-events-none absolute bottom-0 left-0 hidden max-w-2xl p-8 md:block lg:p-12">
              <span className="eyebrow mb-3 flex items-center gap-3 text-fog">
                <span className="rounded-full border border-white/20 px-2.5 py-1">Featured</span>
                {meta}
              </span>
              <span className="block text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-paper transition-transform duration-700 ease-(--ease-cinema) group-hover:translate-x-2">
                {project.title}
              </span>
              <span className="mt-3 block text-silver">
                {project.client ? `${project.client} — ` : ''}
                {project.role}
              </span>
            </span>
            {project.sample && (
              <span className="absolute left-4 top-4 hidden md:block">
                <SampleBadge />
              </span>
            )}
            {indicator}
          </span>
          <span className="md:hidden">{caption}</span>
        </button>
      </motion.article>
    )
  }

  if (variant === 'split') {
    // Portrait / square work beside its story, never cropped into a landscape slot.
    return (
      <motion.article className={cn('grid items-end gap-8 md:grid-cols-12', className)} style={style} initial="hidden" whileInView="visible" viewport={viewport} variants={{}}>
        <button {...buttonProps} className={cn(buttonProps.className, 'md:col-span-5 lg:col-span-4')}>
          <motion.span variants={clipReveal} className="relative mx-auto block max-h-[80svh]" style={{ aspectRatio: aspect, maxWidth: `calc(80svh * ${aspect})` }}>
            {media}
            {indicator}
          </motion.span>
          <span className="md:hidden">{caption}</span>
        </button>
        <motion.div variants={fadeUp} className="hidden md:col-span-6 md:col-start-7 md:block lg:col-span-5 lg:col-start-7">
          <p className="eyebrow mb-4 text-smoke">
            {pad(index + 1)} / {pad(total)} — {meta}
          </p>
          <h3 className="text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-paper">{project.title}</h3>
          <p className="mt-3 text-silver">
            {project.client ? `${project.client} — ` : ''}
            {project.role}
          </p>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-silver/90">{project.description}</p>
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpen(project.id)}
              className="group/cta inline-flex h-11 items-center gap-3 rounded-full border border-white/15 pl-5 pr-1.5 text-sm text-paper transition-colors hover:border-white/40"
            >
              View project
              <span className="grid size-8 place-items-center rounded-full bg-paper text-ink-950 transition-transform duration-500 group-hover/cta:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </button>
            {project.sample && <SampleBadge />}
          </div>
        </motion.div>
      </motion.article>
    )
  }

  return (
    <motion.article
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 1, ease: ease.cinema, delay: (index % 2) * 0.1 }}
    >
      <button {...buttonProps}>
        <span className="relative block" style={{ aspectRatio: aspect }}>
          {media}
          {indicator}
        </span>
        {caption}
      </button>
    </motion.article>
  )
}

function SampleBadge() {
  return (
    <span className="eyebrow inline-flex shrink-0 items-center gap-2 rounded-full border border-dashed border-white/25 bg-ink-950/60 px-3 py-1.5 text-fog">
      Sample slot
    </span>
  )
}
