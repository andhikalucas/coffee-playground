import { useId, useMemo } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { wobblyLinePath } from '../../lib/wobble'
import { useElementSize } from '../../hooks/useElementSize'
import styles from './handmade.module.css'

interface WobblyUnderlineProps {
  children: ReactNode
  seed?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

/** Wraps inline content and draws a hand-inked underline in beneath it. */
export function WobblyUnderline({
  children,
  seed,
  stroke = 'var(--red)',
  strokeWidth = 3,
  className,
}: WobblyUnderlineProps) {
  const autoId = useId()
  const [ref, { width }] = useElementSize<HTMLSpanElement>()
  const d = useMemo(
    () => (width > 4 ? wobblyLinePath(0, 5, width, 5, { seed: seed ?? autoId, amplitude: 2.4 }) : ''),
    [width, seed, autoId],
  )

  return (
    <span ref={ref} className={`${styles.underlineWrap} ${className ?? ''}`}>
      {children}
      {d && (
        <svg
          className={styles.underlineSvg}
          viewBox={`0 0 ${width} 10`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
          />
        </svg>
      )}
    </span>
  )
}
