import { useId, useMemo } from 'react'
import { wobblyLinePath } from '../../lib/wobble'
import { useElementSize } from '../../hooks/useElementSize'
import styles from './handmade.module.css'

interface WobblyDividerProps {
  seed?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

/** A hand-ruled horizontal line. */
export function WobblyDivider({
  seed,
  stroke = 'var(--ink)',
  strokeWidth = 2,
  className,
}: WobblyDividerProps) {
  const autoId = useId()
  const [ref, { width }] = useElementSize()
  const d = useMemo(
    () => (width > 4 ? wobblyLinePath(2, 5, width - 2, 5, { seed: seed ?? autoId }) : ''),
    [width, seed, autoId],
  )

  return (
    <div ref={ref} className={`${styles.divider} ${className ?? ''}`} aria-hidden="true">
      {d && (
        <svg className={styles.dividerSvg} viewBox={`0 0 ${width} 10`} preserveAspectRatio="none">
          <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
