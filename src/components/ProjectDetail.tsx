import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { Project } from '../types'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { categories, ratio, resolvePoster, resolveVideo } from '../lib/media'
import { ease } from '../motion/tokens'
import { Badge } from './ProjectCard'
import { VideoPlayer } from './VideoPlayer'

interface ProjectDetailProps {
  project: Project
  projects: Project[]
  onClose: () => void
  onNavigate: (id: string) => void
}

/** Full-screen, accessible project view. Deep-linkable via #/work/<id>. */
export default function ProjectDetail({ project, projects, onClose, onNavigate }: ProjectDetailProps) {
  const dialog = useRef<HTMLDivElement>(null)
  useScrollLock(true)
  useFocusTrap(dialog, true, onClose)

  // Moving between projects starts each one at its video.
  useEffect(() => {
    dialog.current?.scrollTo({ top: 0 })
  }, [project.id])

  const index = projects.findIndex((p) => p.id === project.id)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const aspect = ratio(project.aspectRatio)
  const meta: Array<[string, string]> = [
    ...(project.client ? ([['Client', project.client]] as Array<[string, string]>) : []),
    ['Role', project.role],
    ['Category', categories(project).join(', ')],
    ...(project.year ? ([['Year', String(project.year)]] as Array<[string, string]>) : []),
    ...(project.details ?? []).map((d) => [d.label, d.value] as [string, string]),
  ]

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      tabIndex={-1}
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-ink-950/95 backdrop-blur-2xl outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: ease.out } }}
      transition={{ duration: 0.5, ease: ease.glide }}
    >
      <div className="sticky top-0 z-10 bg-gradient-to-b from-ink-950 via-ink-950/80 to-transparent">
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="group inline-flex h-10 items-center gap-2.5 rounded-full border border-white/12 pl-3 pr-4 text-sm text-paper transition-colors hover:border-white/40"
          >
            <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-0.5" aria-hidden />
            Back to work
          </button>
          <p className="eyebrow hidden text-smoke sm:block" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
          <button type="button" onClick={onClose} aria-label="Close project" className="grid size-10 place-items-center rounded-full border border-white/12 text-paper transition-colors hover:border-white/40">
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <motion.div
        key={project.id}
        className="container-x pb-20 pt-2 md:pb-28"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: ease.cinema, delay: 0.05 }}
      >
        <motion.div initial={{ clipPath: 'inset(6% 4% 6% 4% round 18px)' }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }} transition={{ duration: 1, ease: ease.cinema }}>
          <VideoPlayer
            key={project.id}
            source={resolveVideo(project.videoUrl)}
            poster={resolvePoster(project)}
            title={project.title}
            seed={project.id}
            aspect={aspect}
            autoPlay
          />
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-10 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4 text-smoke">
              {categories(project).join(' · ')}
              {(project.sample || project.aiGenerated) && (
                <span className="ml-3 inline-block align-middle">
                  <Badge label={project.sample ? 'Sample slot' : 'AI-generated'} ai={!project.sample} />
                </span>
              )}
            </p>
            <h2 id="project-title" className="text-display text-[clamp(2.5rem,6vw,5.5rem)] text-paper">
              {project.title}
            </h2>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-silver">{project.description}</p>
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-paper pl-6 pr-2 text-sm font-medium text-ink-950"
              >
                {project.externalLabel ?? 'View project'}
                <span className="grid size-8 place-items-center rounded-full bg-ink-950 text-paper transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>

          <dl className="glass self-start rounded-[var(--radius-panel)] p-6 md:col-span-5 md:p-8">
            {meta.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 border-b border-white/[0.07] py-3.5 first:pt-0 last:border-0 last:pb-0">
                <dt className="eyebrow pt-0.5 text-smoke">{label}</dt>
                <dd className="text-right text-sm text-fog">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {projects.length > 1 && (
          <nav aria-label="More projects" className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-3 border-t border-white/10 pt-8">
            <button type="button" onClick={() => onNavigate(prev.id)} className="group text-left">
              <span className="eyebrow flex items-center gap-2 text-smoke">
                <ArrowLeft className="size-3.5" aria-hidden /> Previous
              </span>
              <span className="mt-2 block text-lg font-medium tracking-tight text-silver transition-colors group-hover:text-paper md:text-2xl">{prev.title}</span>
            </button>
            <button type="button" onClick={() => onNavigate(next.id)} className="group text-right">
              <span className="eyebrow flex items-center justify-end gap-2 text-smoke">
                Next <ArrowRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-2 block text-lg font-medium tracking-tight text-silver transition-colors group-hover:text-paper md:text-2xl">{next.title}</span>
            </button>
          </nav>
        )}
      </motion.div>
    </motion.div>
  )
}
