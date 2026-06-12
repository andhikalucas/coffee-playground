import { useId, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { wobblyRectPath } from '../../lib/wobble'
import { useElementSize } from '../../hooks/useElementSize'
import styles from './handmade.module.css'

interface WobblyFrameProps {
  children?: ReactNode
  /** stable wobble identity; defaults to a per-instance id */
  seed?: string
  stroke?: string
  strokeWidth?: number
  amplitude?: number
  /** paper color painted inside the inked outline */
  fill?: string
  /** second fainter pass of ink — sketchier */
  doubleStroke?: boolean
  padding?: number | string
  className?: string
  style?: CSSProperties
}

const MARGIN = 8

/** A hand-inked border drawn around whatever you put inside. */
export function WobblyFrame({
  children,
  seed,
  stroke = 'var(--ink)',
  strokeWidth = 2.5,
  amplitude = 2.2,
  fill,
  doubleStroke = true,
  padding = 14,
  className,
  style,
}: WobblyFrameProps) {
  const autoId = useId()
  const wobbleSeed = seed ?? autoId
  const [ref, { width, height }] = useElementSize()

  const paths = useMemo(() => {
    if (width < 4 || height < 4) return null
    return {
      main: wobblyRectPath(width, height, { seed: wobbleSeed, amplitude }),
      ghost: wobblyRectPath(width, height, { seed: wobbleSeed + '_b', amplitude: amplitude * 1.4 }),
    }
  }, [width, height, wobbleSeed, amplitude])

  return (
    <div ref={ref} className={`${styles.frame} ${className ?? ''}`} style={{ padding, ...style }}>
      {paths && (
        <svg
          className={styles.frameSvg}
          viewBox={`${-MARGIN} ${-MARGIN} ${width + MARGIN * 2} ${height + MARGIN * 2}`}
          aria-hidden="true"
        >
          <path
            d={paths.main}
            fill={fill ?? 'none'}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {doubleStroke && (
            <path
              d={paths.ghost}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth * 0.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.35}
            />
          )}
        </svg>
      )}
      <div className={styles.frameContent}>{children}</div>
    </div>
  )
}
