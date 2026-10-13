import { useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import type { Project } from '../types'
import { useFinePointer } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { prefersLightMedia, resolvePoster, resolvePreview } from '../lib/media'
import { claimPlayback, releasePlayback } from '../lib/playback'
import { MediaArt } from './MediaArt'

interface ProjectMediaProps {
  project: Project
  /** Hover state from the parent card (fine pointers only). */
  hovered: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

/**
 * Poster-first media frame for gallery cards.
 *  • Poster loads lazily; a generated title card stands in if it is missing or fails.
 *  • The preview <video> is only created when it should play (hover on desktop,
 *    mostly-in-view on touch), with preload="none" — nothing downloads up front.
 *  • Off-screen previews pause; only one preview runs at a time.
 */
export function ProjectMedia({ project, hovered, sizes, priority, className }: ProjectMediaProps) {
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const key = useRef(Symbol(useId()))
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const poster = resolvePoster(project)
  const previewSrc = resolvePreview(project)
  const [posterFailed, setPosterFailed] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.6), { threshold: [0, 0.6] })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const canPreview = Boolean(previewSrc) && !previewFailed && !reduce && !prefersLightMedia()
  const wantsPlay = canPreview && (fine ? hovered && inView : inView)
  const [mounted, setMounted] = useState(false)
  if (wantsPlay && !mounted) setMounted(true)

  useEffect(() => {
    const el = video.current
    const id = key.current
    if (!el) return
    if (wantsPlay) {
      const pause = () => el.pause()
      if (claimPlayback(id, 'preview', pause)) {
        el.play().catch(() => undefined)
      }
    } else {
      el.pause()
      releasePlayback(id)
    }
  }, [wantsPlay, mounted])

  useEffect(() => () => releasePlayback(key.current), [])

  const showArt = !poster || posterFailed

  return (
    <div ref={frame} className={cn('relative overflow-hidden bg-ink-800', className)}>
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-(--ease-cinema) group-hover:scale-[1.035] group-focus-visible:scale-[1.035]">
        {showArt ? (
          <MediaArt seed={project.id} title={project.title} label={project.sample ? 'Poster pending' : undefined} />
        ) : (
          <img
            src={poster}
            alt=""
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setPosterLoaded(true)}
            onError={() => setPosterFailed(true)}
            className={cn('absolute inset-0 size-full object-cover transition-opacity duration-700', posterLoaded ? 'opacity-100' : 'opacity-0')}
          />
        )}

        {mounted && previewSrc && (
          <video
            ref={video}
            src={previewSrc}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setPreviewFailed(true)}
            className={cn('absolute inset-0 size-full object-cover transition-opacity duration-700', playing ? 'opacity-100' : 'opacity-0')}
          />
        )}
      </div>

      {/* Gentle luminance lift on interaction; never filters the footage itself. */}
      <div className="pointer-events-none absolute inset-0 bg-ink-950/20 transition-opacity duration-700 group-hover:opacity-0 group-focus-visible:opacity-0" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.07] transition-[box-shadow] duration-700 group-hover:ring-white/25" />
    </div>
  )
}
