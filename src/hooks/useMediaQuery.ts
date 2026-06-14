import { useEffect, useState } from 'react'

/**
 * Reactive media-query match. Mirrors the CSS breakpoints we use elsewhere so a
 * component can branch its *behaviour* (not just styling) — e.g. swap an inline
 * panel for a popup below a width. SSR-safe: defaults to `false` until mounted.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
