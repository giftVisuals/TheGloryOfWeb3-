/**
 * Playback coordinator — guarantees at most one prominent video plays, and at
 * most one gallery preview runs, at any moment.
 *
 *  main     → the project-detail player. Starting it pauses everything else.
 *  preview  → muted gallery previews. Starting one pauses the other previews;
 *             previews are refused while a main video is playing.
 */
type Level = 'main' | 'preview'
interface Entry {
  level: Level
  pause: () => void
}

const playing = new Map<symbol, Entry>()

export function claimPlayback(id: symbol, level: Level, pause: () => void): boolean {
  if (level === 'preview' && [...playing.values()].some((e) => e.level === 'main')) return false
  for (const [key, entry] of playing) {
    if (key === id) continue
    if (level === 'main' || entry.level === 'preview') {
      entry.pause()
      playing.delete(key)
    }
  }
  playing.set(id, { level, pause })
  return true
}

export function releasePlayback(id: symbol) {
  playing.delete(id)
}
