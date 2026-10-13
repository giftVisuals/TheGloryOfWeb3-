import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { contact } from '../content/site'
import { useCopy } from '../hooks/useCopy'
import { MaskedText, Reveal } from '../motion/Reveal'

export function Contact() {
  const { copied, copy } = useCopy()
  const hasChannels = Boolean(contact.email) || contact.links.length > 0
  const emailCopied = copied === contact.email

  const copyEmail = async () => {
    if (!(await copy(contact.email))) window.location.href = `mailto:${contact.email}`
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-16 pt-24 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_70%_at_50%_100%,rgb(255_255_255/0.08),transparent)]" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow mb-8 flex items-center gap-3 text-smoke">
            <span className="text-paper">05</span>
            <span aria-hidden className="h-px w-8 bg-white/25" />
            Contact
          </p>
        </Reveal>

        <h2 id="contact-title" className="text-display max-w-[16ch] text-[clamp(3rem,9vw,9rem)] text-paper">
          <MaskedText text={contact.heading} />
        </h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          {contact.email ? (
            <Reveal className="md:col-span-7">
              <p className="eyebrow mb-4 text-smoke">Write to me</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 break-all text-[clamp(1.5rem,3.6vw,3rem)] font-medium tracking-[-0.03em] text-paper"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-(--ease-cinema) group-hover:bg-[length:100%_1px]">
                    {contact.email}
                  </span>
                  <ArrowUpRight className="size-[0.8em] shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs text-paper"
                  aria-label={emailCopied ? 'Email address copied' : 'Copy email address'}
                >
                  {emailCopied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                  <span aria-live="polite">{emailCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </Reveal>
          ) : (
            <Reveal className="md:col-span-7">
              <p className="max-w-md text-lg leading-relaxed text-silver">
                {hasChannels ? 'Reach out through any of the channels listed here.' : 'Direct contact details will be published here shortly.'}
              </p>
              <a href="#work" className="group mt-6 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-sm text-paper transition-colors hover:border-paper">
                Explore the work
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
              {import.meta.env.DEV && !contact.email && (
                <p className="mt-4 max-w-md rounded-xl border border-dashed border-white/20 p-4 font-mono text-xs leading-relaxed text-fog">
                  Dev note (hidden in production): add your public email to <code>contact.email</code> in src/content/site.ts.
                </p>
              )}
            </Reveal>
          )}

          {contact.links.length > 0 && (
            <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
              <p className="eyebrow mb-4 text-smoke">Elsewhere</p>
              <ul className="border-t border-white/10">
                {contact.links.map((link) => {
                  const row = 'group flex w-full items-center justify-between gap-4 border-b border-white/10 py-4 text-left text-paper'
                  const label = <span className="text-lg tracking-tight">{link.label}</span>
                  if (!link.url) {
                    const handle = link.handle ?? ''
                    const done = copied === handle
                    return (
                      <li key={link.label}>
                        <button type="button" onClick={() => copy(handle)} className={row} aria-label={`Copy ${link.label} username ${handle}`}>
                          {label}
                          <span className="flex items-center gap-2 text-sm text-silver transition-colors group-hover:text-paper">
                            <span aria-live="polite">{done ? 'Copied' : handle}</span>
                            {done ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                          </span>
                        </button>
                      </li>
                    )
                  }
                  return (
                    <li key={link.label}>
                      <a href={link.url} target="_blank" rel="noreferrer" className={row}>
                        {label}
                        <span className="flex items-center gap-2 text-sm text-silver transition-colors group-hover:text-paper">
                          {link.handle}
                          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                        </span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
