import { useId, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { tornEdgePolygon } from '../../lib/wobble'
import styles from './handmade.module.css'

const VARIANT_CLASS = [styles.tapeCaramel, styles.tapeStripes, styles.tapeDots] as const

interface WashiTapeProps {
  variant?: 0 | 1 | 2
  length?: number
  rotation?: number
  seed?: string
  className?: string
  style?: CSSProperties
}

/** A strip of translucent washi tape with ripped ends. Position it yourself. */
export function WashiTape({
  variant = 0,
  length = 90,
  rotation = 0,
  seed,
  className,
  style,
}: WashiTapeProps) {
  const autoId = useId()
  const clipPath = useMemo(
    () =>
      tornEdgePolygon(length, 26, { left: true, right: true }, { seed: seed ?? autoId, tooth: 5, depth: 6 }),
    [length, seed, autoId],
  )

  return (
    <span
      className={`${styles.tape} ${VARIANT_CLASS[variant]} ${className ?? ''}`}
      style={{ width: length, transform: `rotate(${rotation}deg)`, clipPath, ...style }}
      aria-hidden="true"
    />
  )
}
