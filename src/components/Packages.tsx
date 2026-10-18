import { ArrowUpRight, Check, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { contact, packages } from '../content/site'
import { ease, viewport } from '../motion/tokens'
import { SectionHeading } from './SectionHeading'
import { GlassCard } from './ui/GlassCard'

/** "Ways to work together": clear offers founders can pick from. */
export function Packages() {
  return (
    <section id="packages" aria-labelledby="packages-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.05),transparent)]" />
      <div className="container-x relative">
        <SectionHeading
          index="04"
          label="Packages"
          title="Ways to work together."
          id="packages-title"
          aside={<p className="max-w-xs text-sm leading-relaxed text-silver md:text-right">{packages.pricing}</p>}
        />

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {packages.items.map((pkg, i) => (
            <motion.li
              key={pkg.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: ease.cinema, delay: i * 0.08 }}
            >
              <GlassCard className="flex h-full flex-col rounded-[var(--radius-panel)] p-6 hover:-translate-y-1.5 hover:border-white/15 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="eyebrow text-smoke">{String(i + 1).padStart(2, '0')}</span>
                  <span className="eyebrow rounded-full border border-white/12 px-2.5 py-1 text-fog">{pkg.length}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-paper md:text-[1.75rem]">{pkg.name}</h3>
                <p className="mt-2 text-sm text-silver">{pkg.bestFor}</p>

                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-snug text-fog">
                      <Check className="mt-0.5 size-4 shrink-0 text-paper" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <p className="flex items-center gap-2 text-sm text-paper">
                    <Clock className="size-4 text-silver" aria-hidden />
                    {pkg.turnaround}
                  </p>
                  <a
                    href={contact.primary.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group/cta mt-5 flex h-11 items-center justify-between rounded-full border border-white/15 pl-5 pr-1.5 text-sm text-paper transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04]"
                  >
                    Start a {pkg.name}
                    <span className="grid size-8 place-items-center rounded-full bg-paper text-ink-950 transition-transform duration-500 ease-(--ease-cinema) group-hover/cta:rotate-45">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                    <span className="sr-only">(opens Telegram)</span>
                  </a>
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
