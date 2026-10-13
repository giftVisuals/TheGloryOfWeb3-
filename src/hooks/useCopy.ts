import { useCallback, useEffect, useRef, useState } from 'react'

/** Copies text to the clipboard and reports success for ~2s. */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(null), 2000)
      return true
    } catch {
      return false
    }
  }, [])

  return { copied, copy }
}
