import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = '#/work/'

function readHash(): string | null {
  return window.location.hash.startsWith(PREFIX) ? decodeURIComponent(window.location.hash.slice(PREFIX.length)) : null
}

/**
 * Deep-linkable project view: #/work/<id>. Opening pushes a history entry so
 * the browser back button (and swipe-back on mobile) closes the project.
 */
export function useProjectRoute() {
  const [activeId, setActiveId] = useState<string | null>(readHash)
  const pushed = useRef(false)

  useEffect(() => {
    const sync = () => {
      const id = readHash()
      if (!id) pushed.current = false
      setActiveId(id)
    }
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const open = useCallback((id: string) => {
    const url = PREFIX + encodeURIComponent(id)
    if (readHash()) {
      history.replaceState(null, '', url)
    } else {
      history.pushState(null, '', url)
      pushed.current = true
    }
    setActiveId(id)
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      history.back()
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search + '#work')
      setActiveId(null)
    }
  }, [])

  return { activeId, open, close }
}
