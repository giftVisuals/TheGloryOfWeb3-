import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { services } from '../content/site'
import { useFinePointer } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { ease, viewport } from '../motion/tokens'
import { SectionHeading } from './SectionHeading'
import { Turnaround } from './Turnaround'

/** The inverted, off-white chapter — the 30% in the 70/30 balance. */
export function Services() {
  const [open, setOpen] = useState<number | null>(0)
  const fine = useFinePointer()

  return (
    <section id="services" aria-labelledby="services-title" className="surface-light relative bg-bone py-24 text-ink-950 md:py-36">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Services"
          title="What I bring to the edit."
          id="services-title"
          tone="light"
          aside={<p className="max-w-xs text-sm leading-relaxed text-ink-600/80 md:text-right">Engagements are shaped around the story, the audience and where the video will live.</p>}
        />

        <Turnaround />

        <ul className="mt-14 border-t border-ink-950/15 md:mt-20">
          {services.map((service, i) => {
            const expanded = open === i
            const panelId = `service-${i}`
            return (
              <motion.li
                key={service.title}
                className="group/row relative border-b border-ink-950/15"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.8, ease: ease.cinema, delay: i * 0.05 }}
                onPointerEnter={() => fine && setOpen(i)}
              >
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 -z-0 origin-left bg-[linear-gradient(90deg,rgb(0_0_0/0.05),rgb(0_0_0/0.0))] transition-transform duration-700 ease-(--ease-cinema)',
                    expanded ? 'scale-x-100' : 'scale-x-0 group-hover/row:scale-x-100',
                  )}
                />
                <h3 className="relative">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[6rem_1fr_auto] md:py-8"
                  >
                    <span className="eyebrow text-ink-600/60">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn('text-[clamp(1.6rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] transition-transform duration-700 ease-(--ease-cinema)', expanded && 'md:translate-x-3')}>
                      {service.title}
                      {service.turnaround && (
                        <span className="eyebrow ml-3 inline-flex translate-y-[-0.35em] items-center rounded-full bg-ink-950 px-2.5 py-1 align-middle text-[0.6rem] tracking-[0.14em] text-bone md:ml-4">
                          {service.turnaround}
                        </span>
                      )}
                    </span>
                    <span className={cn('grid size-10 place-items-center rounded-full border transition-all duration-500 ease-(--ease-cinema)', expanded ? 'rotate-45 border-ink-950 bg-ink-950 text-bone' : 'border-ink-950/20')}>
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <div id={panelId} className={cn('relative grid transition-[grid-template-rows] duration-700 ease-(--ease-cinema)', expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden" inert={!expanded}>
                    <p className="max-w-xl pb-8 pl-[calc(2.5rem+1rem)] leading-relaxed text-ink-600 md:pl-[calc(6rem+1rem)] md:text-lg">{service.description}</p>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
