import { cn } from '../lib/cn'

interface MediaArtProps {
  seed: string
  title: string
  label?: string
  className?: string
}

function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  return h >>> 0
}

/**
 * Generated monochrome title card, used when a project has no poster yet.
 * Deterministic per project so each card keeps its own composition.
 */
export function MediaArt({ seed, title, label, className }: MediaArtProps) {
  const h = hash(seed)
  const x = 20 + (h % 60)
  const y = 15 + ((h >> 8) % 50)
  const angle = (h >> 16) % 180
  return (
    <div
      aria-hidden
      className={cn('@container absolute inset-0 overflow-hidden bg-ink-800', className)}
      style={{
        backgroundImage: `radial-gradient(70% 90% at ${x}% ${y}%, rgb(255 255 255 / 0.16), transparent 60%), linear-gradient(${angle}deg, #050505, #1c1c1c 55%, #0a0a0a)`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]" />
      <div className="absolute inset-[6%] border border-white/[0.07]" />
      <span className="absolute left-[6%] top-[6%] m-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
        {label ?? 'No preview yet'}
      </span>
      <span className="absolute bottom-[6%] left-[6%] right-[6%] m-3 line-clamp-2 text-[clamp(1.1rem,4.5cqi,3.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-white/[0.14]">
        {title}
      </span>
    </div>
  )
}
