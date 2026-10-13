import { credibility } from '../content/site'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

/**
 * Testimonials & collaborators. Renders nothing until `credibility.enabled`
 * is true and real, approved content exists in src/content/site.ts.
 */
export function Credibility() {
  const { enabled, testimonials, collaborators } = credibility
  if (!enabled || (testimonials.length === 0 && collaborators.length === 0)) return null

  return (
    <section id="kind-words" aria-labelledby="credibility-title" className="py-24 md:py-36">
      <div className="container-x">
        <SectionHeading index="—" label="Collaborations" title="In good company." id="credibility-title" />

        {collaborators.length > 0 && (
          <Reveal>
            <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-y border-white/10 py-8">
              {collaborators.map((name) => (
                <li key={name} className="text-xl font-medium tracking-tight text-silver">
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {testimonials.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <figure className="glass h-full rounded-[var(--radius-panel)] p-8 md:p-10">
                  <blockquote className="text-pretty text-xl leading-snug tracking-tight text-paper md:text-2xl">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 text-sm text-silver">
                    {t.url ? (
                      <a href={t.url} target="_blank" rel="noreferrer" className="text-paper underline-offset-4 hover:underline">
                        {t.name}
                      </a>
                    ) : (
                      <span className="text-paper">{t.name}</span>
                    )}
                    {t.role && <span> — {t.role}</span>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
