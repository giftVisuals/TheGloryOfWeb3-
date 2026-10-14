import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import type { Project } from '../types'
import { cn } from '../lib/cn'
import { categories, ratio } from '../lib/media'
import { ease } from '../motion/tokens'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

type Row = { kind: 'featured' | 'split' | 'solo'; project: Project } | { kind: 'row'; projects: Project[] }

/**
 * Curated composition rules (no repeating card template):
 *  • Featured landscape work → full-width cinematic frame.
 *  • Featured or lone portrait/square work → media beside its story.
 *  • Everything else → justified rows. Widths follow each video's native
 *    ratio so every item in a row shares one height and nothing is cropped.
 */
function compose(list: Project[]): Row[] {
  const rows: Row[] = []
  const rest: Project[] = []
  for (const p of list) {
    if (p.featured) rows.push({ kind: ratio(p.aspectRatio) > 1.2 ? 'featured' : 'split', project: p })
    else rest.push(p)
  }

  let bucket: Project[] = []
  let sum = 0
  const flush = () => {
    if (bucket.length === 1) {
      const p = bucket[0]
      rows.push({ kind: ratio(p.aspectRatio) > 1.2 ? 'solo' : 'split', project: p })
    } else if (bucket.length) {
      rows.push({ kind: 'row', projects: bucket })
    }
    bucket = []
    sum = 0
  }
  for (const p of rest) {
    bucket.push(p)
    sum += ratio(p.aspectRatio)
    // ~2.2 total ratio per row keeps portrait work readable (portrait + landscape = one row).
    if (sum >= 2.2 || bucket.length === 3) flush()
  }
  flush()
  return rows
}

interface WorkGalleryProps {
  projects: Project[]
  onOpen: (id: string) => void
}

export function WorkGallery({ projects, onOpen }: WorkGalleryProps) {
  const [filter, setFilter] = useState<string | null>(null)
  // Only categories that actually narrow the list (one shared by every project is a no-op).
  const allCategories = useMemo(() => {
    const real = projects.filter((p) => !p.sample)
    return [...new Set(real.flatMap(categories))].filter((c) => real.filter((p) => categories(p).includes(c)).length < real.length)
  }, [projects])
  const showFilter = allCategories.length >= 2 && projects.length >= 4
  const visible = filter ? projects.filter((p) => categories(p).includes(filter)) : projects
  const rows = useMemo(() => compose(visible), [visible])
  const total = visible.length
  const indexOf = (p: Project) => visible.indexOf(p)

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          index="01"
          label="Selected work"
          title="The work speaks first."
          id="work-title"
          aside={
            <p className="max-w-xs text-sm leading-relaxed text-silver md:text-right">
              Edits, motion design and visual stories. Select any project to watch it in full.
              <span className="eyebrow mt-3 block text-smoke">{String(projects.length).padStart(2, '0')} projects</span>
            </p>
          }
        />

        {showFilter && (
          <div role="group" aria-label="Filter projects by category" className="mt-12 flex flex-wrap gap-2">
            {[null, ...allCategories].map((c) => (
              <button
                key={c ?? 'all'}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={cn(
                  'eyebrow rounded-full border px-4 py-2.5 transition-colors duration-300',
                  filter === c ? 'border-paper bg-paper text-ink-950' : 'border-white/12 text-silver hover:border-white/35 hover:text-paper',
                )}
              >
                {c ?? 'All'}
              </button>
            ))}
          </div>
        )}

        {projects.length === 0 ? (
          <p className="mt-16 rounded-[var(--radius-panel)] border border-dashed border-white/15 p-10 text-silver">
            New work is being prepared for this space.
          </p>
        ) : (
          <motion.div key={filter ?? 'all'} className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-32" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: ease.cinema }}>
            {rows.map((row, r) => {
              if (row.kind === 'row') {
                return (
                  <div key={r} className="flex flex-col gap-16 md:flex-row md:items-start md:gap-8 lg:gap-10">
                    {row.projects.map((p, i) => {
                      const ar = ratio(p.aspectRatio)
                      return (
                        <ProjectCard
                          key={p.id}
                          project={p}
                          index={indexOf(p)}
                          total={total}
                          variant="tile"
                          onOpen={onOpen}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          // On phones, portrait work is held to a comfortable width instead of filling the screen.
                          className={cn('min-w-0 md:basis-0', ar < 1 && 'mx-auto w-full max-w-[22rem] md:mx-0 md:max-w-none', i % 2 === 1 && r % 2 === 0 && 'md:mt-28')}
                          // flex-grow proportional to aspect ratio → equal heights across the row.
                          style={{ flexGrow: ar }}
                        />
                      )
                    })}
                  </div>
                )
              }
              const p = row.project
              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={indexOf(p)}
                  total={total}
                  variant={row.kind === 'solo' ? 'tile' : row.kind}
                  onOpen={onOpen}
                  sizes={row.kind === 'featured' ? '100vw' : '(min-width: 768px) 70vw, 100vw'}
                  className={cn(row.kind === 'solo' && (r % 2 ? 'md:ml-auto md:w-3/4' : 'md:w-3/4'))}
                />
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
