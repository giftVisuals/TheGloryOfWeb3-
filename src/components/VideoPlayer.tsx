import { ExternalLink, LoaderCircle, Maximize, Minimize, Pause, Play, RotateCcw, TriangleAlert, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { cn } from '../lib/cn'
import { prefersLightMedia, type MediaSource } from '../lib/media'
import { claimPlayback, releasePlayback } from '../lib/playback'
import { ease } from '../motion/tokens'
import { MediaArt } from './MediaArt'

interface VideoPlayerProps {
  source: MediaSource
  title: string
  seed: string
  poster?: string
  aspect: number
  /** Start muted playback as soon as the player opens (never with sound). */
  autoPlay?: boolean
  className?: string
}

export function VideoPlayer(props: VideoPlayerProps) {
  const { source } = props
  if (source.kind === 'file') return <FilePlayer {...props} src={source.src} />
  if (source.kind === 'embed') return <EmbedPlayer {...props} source={source} />
  return (
    <Frame aspect={props.aspect} className={props.className}>
      <MediaArt seed={props.seed} title={props.title} label="Video coming soon" />
      <div className="absolute inset-0 grid place-items-center p-6">
        <p className="glass rounded-full px-4 py-2 text-center text-xs text-fog sm:px-5 sm:py-2.5 sm:text-sm">The full video for this project will be published soon.</p>
      </div>
    </Frame>
  )
}

interface FrameProps extends HTMLAttributes<HTMLDivElement> {
  aspect: number
  /** Fill the parent (used in fullscreen) instead of holding the aspect ratio. */
  fill?: boolean
  frameRef?: Ref<HTMLDivElement>
}

/** Holds the native ratio and never exceeds ~76% of the viewport height. */
function Frame({ aspect, fill, frameRef, className, children, ...dom }: FrameProps) {
  return (
    <div
      ref={frameRef}
      {...dom}
      className={cn('relative mx-auto w-full overflow-hidden rounded-[var(--radius-frame)] bg-ink-950 shadow-frame', className)}
      style={fill ? { width: '100%', height: '100%' } : { aspectRatio: aspect, maxWidth: `min(100%, calc(76svh * ${aspect}))` }}
    >
      {children}
    </div>
  )
}

const fmt = (t: number) => {
  if (!Number.isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/* ── Custom player for direct files ──────────────────────────────────── */

function FilePlayer({ src, poster, title, seed, aspect, autoPlay, className }: VideoPlayerProps & { src: string }) {
  const container = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const key = useRef(Symbol(useId()))
  const hideTimer = useRef<number>(0)
  const reduce = useReducedMotion()

  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [failed, setFailed] = useState(false)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [chrome, setChrome] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const canFullscreen = typeof document !== 'undefined' && (document.fullscreenEnabled || 'webkitEnterFullscreen' in HTMLVideoElement.prototype)

  const play = useCallback(() => {
    const el = video.current
    if (!el) return
    claimPlayback(key.current, 'main', () => el.pause())
    setStarted(true)
    el.play().catch(() => setPlaying(false))
  }, [])

  const toggle = useCallback(() => {
    const el = video.current
    if (!el) return
    if (el.paused || el.ended) play()
    else el.pause()
  }, [play])

  const toggleMute = useCallback(() => {
    const el = video.current
    if (!el) return
    el.muted = !el.muted
    if (!el.muted && el.volume === 0) el.volume = 0.8
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else if (container.current?.requestFullscreen && document.fullscreenEnabled) {
      void container.current.requestFullscreen()
    } else {
      el?.webkitEnterFullscreen?.() // iOS Safari
    }
  }, [])

  const wake = useCallback(() => {
    setChrome(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (!video.current?.paused && !container.current?.contains(document.activeElement)) setChrome(false)
    }, 2600)
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === container.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    if (autoPlay && !reduce && !prefersLightMedia()) play()
    const id = key.current
    return () => {
      window.clearTimeout(hideTimer.current)
      releasePlayback(id)
    }
  }, [autoPlay, reduce, play])

  useEffect(() => {
    if (playing) wake()
    else setChrome(true)
  }, [playing, wake])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = video.current
    if (!el || (e.target as HTMLElement).tagName === 'INPUT') return
    const keyName = e.key.toLowerCase()
    if (keyName === ' ' || keyName === 'k') {
      e.preventDefault()
      toggle()
    } else if (keyName === 'm') toggleMute()
    else if (keyName === 'f') toggleFullscreen()
    else if (keyName === 'arrowright') el.currentTime = Math.min(el.duration || 0, el.currentTime + 5)
    else if (keyName === 'arrowleft') el.currentTime = Math.max(0, el.currentTime - 5)
    else return
    wake()
  }

  const progress = duration ? (time / duration) * 100 : 0
  const showPoster = !started && poster && !posterFailed

  return (
    <Frame
      aspect={aspect}
      fill={fullscreen}
      className={cn(className, fullscreen && 'rounded-none', playing && !chrome && 'cursor-none')}
      frameRef={container}
      role="region"
      aria-label={`Video player: ${title}`}
      onPointerMove={wake}
      onKeyDown={onKeyDown}
    >
      <video
        ref={video}
        src={src}
        poster={posterFailed ? undefined : poster}
        playsInline
        muted={muted}
        preload="metadata"
        className="absolute inset-0 size-full bg-ink-950 object-contain"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => {
          setBuffering(false)
          setFailed(false)
        }}
        onCanPlay={() => setBuffering(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted)
          setVolume(e.currentTarget.volume)
        }}
        onError={() => {
          setFailed(true)
          setBuffering(false)
        }}
      />

      {!started && !poster && <MediaArt seed={seed} title={title} label="Press play" />}
      {showPoster && (
        <img src={poster} alt="" className="pointer-events-none absolute inset-0 size-full object-contain" onError={() => setPosterFailed(true)} />
      )}

      {/* Large play affordance before playback / while paused. */}
      <AnimatePresence>
        {!playing && !failed && (
          <motion.button
            type="button"
            onClick={play}
            aria-label={started ? 'Resume video' : 'Play video'}
            className="glass absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-paper transition-transform duration-500 hover:scale-105 md:size-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.4, ease: ease.cinema }}
          >
            <Play className="ml-1 size-7 fill-current" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {buffering && !failed && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" role="status" aria-label="Loading video">
          <LoaderCircle className="size-9 animate-spin text-paper/80" aria-hidden />
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-ink-950/80 p-6 text-center" role="alert">
          <div className="max-w-sm">
            <TriangleAlert className="mx-auto mb-4 size-7 text-fog" aria-hidden />
            <p className="text-paper">This video couldn’t be played here.</p>
            <p className="mt-2 text-sm text-silver">The file may be unavailable, private, or in a format this browser can’t decode.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFailed(false)
                  video.current?.load()
                  play()
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-paper hover:border-white/50"
              >
                <RotateCcw className="size-4" aria-hidden /> Try again
              </button>
              <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-paper hover:border-white/50">
                Open file <ExternalLink className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 p-2.5 transition-all duration-500 ease-(--ease-cinema) sm:p-4',
          started && !failed && (chrome || !playing) ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
        onFocusCapture={wake}
      >
        <div className="glass flex items-center gap-1.5 rounded-full px-2 py-1.5 sm:gap-3 sm:px-3">
          <CtrlButton label={playing ? 'Pause' : 'Play'} onClick={toggle}>
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </CtrlButton>
          <span className="font-mono text-[0.7rem] tabular-nums text-fog">
            {fmt(time)}
            <span className="hidden text-smoke sm:inline"> / {fmt(duration)}</span>
          </span>
          <input
            type="range"
            className="range min-w-0 flex-1"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            style={{ '--p': `${progress}%` } as CSSProperties}
            aria-label="Seek"
            aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
            onChange={(e) => {
              const t = Number(e.currentTarget.value)
              if (video.current) video.current.currentTime = t
              setTime(t)
            }}
          />
          <CtrlButton label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
            {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </CtrlButton>
          <input
            type="range"
            className="range hidden w-20 md:block"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            style={{ '--p': `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
            aria-label="Volume"
            onChange={(e) => {
              const el = video.current
              if (!el) return
              el.volume = Number(e.currentTarget.value)
              el.muted = el.volume === 0
            }}
          />
          {canFullscreen && (
            <CtrlButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>
              {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </CtrlButton>
          )}
        </div>
      </div>

      {/* Sound hint while autoplaying muted. */}
      <AnimatePresence>
        {playing && muted && chrome && (
          <motion.button
            type="button"
            onClick={toggleMute}
            className="glass absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-paper sm:right-4 sm:top-4"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: ease.cinema }}
          >
            <VolumeX className="size-3.5" aria-hidden /> Tap for sound
          </motion.button>
        )}
      </AnimatePresence>
    </Frame>
  )
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-full text-paper transition-colors hover:bg-white/10 [&_svg]:pointer-events-none"
    >
      {children}
    </button>
  )
}

/* ── Hosted embeds (Google Drive, YouTube, Vimeo) ────────────────────── */

function EmbedPlayer({ source, poster, title, seed, aspect, className }: VideoPlayerProps & { source: Extract<MediaSource, { kind: 'embed' }> }) {
  // Facade: nothing from the host loads until the visitor asks to play.
  const [active, setActive] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const key = useRef(Symbol(useId()))

  useEffect(() => {
    const id = key.current
    if (active) claimPlayback(id, 'main', () => undefined)
    return () => releasePlayback(id)
  }, [active])

  return (
    <div className="w-full">
      <Frame aspect={aspect} className={className}>
        {active ? (
          <iframe
            src={source.src}
            title={`${title} — video`}
            className="absolute inset-0 size-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 block size-full" aria-label={`Play video: ${title}`}>
            {poster && !posterFailed ? (
              <img src={poster} alt="" className="absolute inset-0 size-full object-cover" onError={() => setPosterFailed(true)} />
            ) : (
              <MediaArt seed={seed} title={title} label={`Plays via ${source.provider}`} />
            )}
            <span className="absolute inset-0 bg-ink-950/25 transition-opacity duration-500 group-hover:opacity-0" />
            <span className="glass absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-paper transition-transform duration-500 group-hover:scale-105 md:size-24">
              <Play className="ml-1 size-7 fill-current" aria-hidden />
            </span>
          </button>
        )}
      </Frame>
      <p className="mx-auto mt-3 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-smoke">
        <span>Plays in the {source.provider} player.</span>
        <a href={source.originalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-silver underline-offset-4 hover:text-paper hover:underline">
          Open on {source.provider} <ExternalLink className="size-3" aria-hidden />
        </a>
      </p>
    </div>
  )
}
