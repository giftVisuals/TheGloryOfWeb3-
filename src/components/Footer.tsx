import { ArrowUp } from 'lucide-react'
import { contact, identity } from '../content/site'
import { useCopy } from '../hooks/useCopy'

export function Footer() {
  const year = new Date().getFullYear()
  const { copied, copy } = useCopy()
  return (
    <footer className="relative">
      <div className="container-x">
        <div aria-hidden className="rule-fade" />
        <div className="flex flex-col gap-6 py-8 text-sm text-smoke md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2.5 text-paper">
            {identity.name}
            <span className="text-smoke">— {identity.roles.join(', ')}</span>
          </p>
          {contact.links.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {contact.links.map((link) => (
                <li key={link.label}>
                  {link.url ? (
                    <a href={link.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
                      {link.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copy(link.handle ?? '')}
                      className="transition-colors hover:text-paper"
                      aria-label={`Copy ${link.label} username ${link.handle}`}
                    >
                      <span aria-live="polite">{copied === link.handle ? `${link.label} copied` : `${link.label}: ${link.handle}`}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between gap-6">
            <p>© {year} {identity.name}. All rights reserved.</p>
            <a href="#top" className="group inline-flex items-center gap-2 text-silver transition-colors hover:text-paper">
              Back to top
              <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
      {/* Oversized closing wordmark, clipped at the baseline. */}
      <p aria-hidden className="text-display pointer-events-none select-none overflow-hidden whitespace-nowrap text-center text-[10.6vw] uppercase leading-[0.74] text-white/[0.04]">
        {identity.name}
      </p>
    </footer>
  )
}
