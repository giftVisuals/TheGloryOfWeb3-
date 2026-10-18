import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { faq } from '../content/site'
import { cn } from '../lib/cn'
import { ease, viewport } from '../motion/tokens'
import { SectionHeading } from './SectionHeading'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rule-fade" />
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionHeading index="06" label="FAQ" title="Before you message." id="faq-title" className="md:block" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-silver">Everything founders usually ask first. Anything else, just ask on Telegram.</p>
        </div>

        <ul className="space-y-3 md:col-span-7">
          {faq.map((item, i) => {
            const expanded = open === i
            const id = `faq-${i}`
            return (
              <motion.li
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.7, ease: ease.cinema, delay: i * 0.05 }}
                className={cn('glass glass-sheen relative rounded-2xl transition-colors duration-500', expanded && 'border-white/20 bg-white/[0.06]!')}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-base font-medium tracking-tight text-paper md:px-6 md:text-lg"
                  >
                    {item.q}
                    <span className={cn('grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-(--ease-cinema)', expanded ? 'rotate-45 border-paper bg-paper text-ink-950' : 'border-white/20')}>
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <div id={id} className={cn('grid transition-[grid-template-rows] duration-500 ease-(--ease-cinema)', expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden" inert={!expanded}>
                    <p className="px-5 pb-6 leading-relaxed text-silver md:px-6">{item.a}</p>
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
