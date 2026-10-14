import type { AspectRatio, Project } from '../types'

/**
 * Media-source layer.
 *
 * A project's `videoUrl` is classified once into one of three playback
 * strategies so components never have to guess:
 *
 *  file   → a direct, browser-playable file. Rendered in the custom player.
 *  embed  → a hosting page (Google Drive, YouTube, Vimeo) that cannot be fed
 *           to <video>. Rendered through the host's official embed player.
 *  none   → no video yet. A poster / title card is shown instead.
 *
 * Google Drive "share" links point to an HTML viewer, not a video stream,
 * and Drive's download endpoints are not a dependable streaming source, so
 * Drive links always use Drive's own /preview embed. Nothing here tries to
 * bypass Drive permissions: the file must be shared publicly by its owner.
 */
export type MediaSource =
  | { kind: 'file'; src: string }
  | { kind: 'embed'; provider: Provider; src: string; originalUrl: string }
  | { kind: 'none' }

export type Provider = 'Google Drive' | 'YouTube' | 'Vimeo'

const DRIVE_ID = /drive\.google\.com\/(?:file\/d\/|open\?(?:[^#]*&)?id=|uc\?(?:[^#]*&)?id=)([\w-]{10,})/
const YOUTUBE_ID = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/
const VIDEO_FILE = /\.(mp4|m4v|webm|mov|ogv|ogg)(?:[?#]|$)/i

/** Resolves a path inside /public against the deployed base URL. */
export function asset(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\.?\//, '')
}

export function driveId(url: string): string | null {
  return url.match(DRIVE_ID)?.[1] ?? null
}

export function resolveVideo(url?: string): MediaSource {
  const value = url?.trim()
  if (!value) return { kind: 'none' }

  const drive = driveId(value)
  if (drive) {
    return {
      kind: 'embed',
      provider: 'Google Drive',
      src: `https://drive.google.com/file/d/${drive}/preview`,
      originalUrl: `https://drive.google.com/file/d/${drive}/view`,
    }
  }

  const yt = value.match(YOUTUBE_ID)?.[1]
  if (yt) {
    return {
      kind: 'embed',
      provider: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: `https://www.youtube.com/watch?v=${yt}`,
    }
  }

  const vimeo = value.match(VIMEO_ID)
  if (vimeo) {
    const hash = vimeo[2] ? `&h=${vimeo[2]}` : ''
    return {
      kind: 'embed',
      provider: 'Vimeo',
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1${hash}`,
      originalUrl: value,
    }
  }

  // Anything else is treated as a direct file (including CDN URLs without an
  // extension). If the browser cannot decode it, the player shows a clear
  // failure state instead of a broken frame.
  return { kind: 'file', src: asset(value) }
}

export function isVideoFile(url: string): boolean {
  return VIDEO_FILE.test(url)
}

/**
 * Poster priority: explicit thumbnail → host thumbnail → none (title card).
 * Drive's thumbnail endpoint is undocumented and only answers for publicly
 * shared files, so callers must handle a failed load.
 */
export function resolvePoster(project: Pick<Project, 'thumbnail' | 'videoUrl'>): string | undefined {
  if (project.thumbnail) return asset(project.thumbnail)
  const url = project.videoUrl ?? ''
  const drive = driveId(url)
  if (drive) return `https://drive.google.com/thumbnail?id=${drive}&sz=w1600`
  const yt = url.match(YOUTUBE_ID)?.[1]
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`
  return undefined
}

/** Direct-file sources for the gallery hover preview (WebM first when supplied), if any. */
export function resolvePreview(project: Pick<Project, 'previewUrl' | 'previewWebmUrl' | 'videoUrl'>): string[] {
  const sources: string[] = []
  if (project.previewWebmUrl) sources.push(asset(project.previewWebmUrl))
  if (project.previewUrl) sources.push(asset(project.previewUrl))
  if (sources.length) return sources
  const source = resolveVideo(project.videoUrl)
  return source.kind === 'file' ? [source.src] : []
}

const MIME: Record<string, string> = { webm: 'video/webm', mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', ogv: 'video/ogg', ogg: 'video/ogg' }
export function videoMime(url: string): string | undefined {
  return MIME[url.split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? '']
}

export function ratio(aspect?: AspectRatio): number {
  if (!aspect) return 16 / 9
  const [w, h] = aspect.split(':').map(Number)
  return w > 0 && h > 0 ? w / h : 16 / 9
}

export function categories(project: Pick<Project, 'category'>): string[] {
  return Array.isArray(project.category) ? project.category : [project.category]
}

/** Respect Data Saver and very slow connections for any optional media. */
export function prefersLightMedia(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '')
}
