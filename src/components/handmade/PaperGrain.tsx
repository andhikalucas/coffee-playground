import { useId } from 'react'
import styles from './handmade.module.css'

/**
 * Paper fiber texture via feTurbulence. Exactly ONE full-screen instance
 * lives in the app shell (filters are GPU-expensive); `scoped` instances are
 * small and reserved for the recipe card so exports keep their texture.
 */
export function PaperGrain({ scoped = false }: { scoped?: boolean }) {
  const id = useId()
  const filterId = `grain-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg className={scoped ? styles.grainScoped : styles.grain} aria-hidden="true">
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}
