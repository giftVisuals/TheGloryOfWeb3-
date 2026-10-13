import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { MaskedText, Reveal } from '../motion/Reveal'

interface SectionHeadingProps {
  index: string
  label: string
  title: string
  id?: string
  aside?: ReactNode
  tone?: 'dark' | 'light'
  className?: string
}

export function SectionHeading({ index, label, title, id, aside, tone = 'dark', className }: SectionHeadingProps) {
  const muted = tone === 'dark' ? 'text-smoke' : 'text-ink-600/60'
  return (
    <div className={cn('grid gap-6 md:grid-cols-12 md:items-end', className)}>
      <div className="md:col-span-8">
        <Reveal>
          <p className={cn('eyebrow mb-5 flex items-center gap-3', muted)}>
            <span className={tone === 'dark' ? 'text-paper' : 'text-ink-950'}>{index}</span>
            <span aria-hidden className={cn('h-px w-8', tone === 'dark' ? 'bg-white/25' : 'bg-ink-950/25')} />
            {label}
          </p>
        </Reveal>
        <h2 id={id} className="text-display text-[clamp(2.6rem,7vw,6.5rem)]">
          <MaskedText text={title} />
        </h2>
      </div>
      {aside && <Reveal className="md:col-span-4 md:justify-self-end" delay={0.15}>{aside}</Reveal>}
    </div>
  )
}
