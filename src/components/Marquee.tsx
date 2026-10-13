import { identity, services } from '../content/site'

/** A slow glass band of disciplines between the hero and the work. Pauses on hover. */
export function Marquee() {
  const words = [...identity.roles, ...services.map((s) => s.title)]
  const row = () => (
    <ul className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <li key={i} className="flex items-center gap-8 pr-8 text-[clamp(1.25rem,2.6vw,2.25rem)] font-medium tracking-[-0.03em] text-fog">
          {w}
          <span aria-hidden className="size-2 rotate-45 border border-white/40" />
        </li>
      ))}
    </ul>
  )

  return (
    <div aria-hidden className="marquee glass relative -rotate-1 overflow-hidden border-x-0 py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:py-7">
      <div className="animate-marquee flex w-max">
        {row()}
        {row()}
      </div>
    </div>
  )
}
