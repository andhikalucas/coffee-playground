import { useId, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { tornEdgePolygon } from '../../lib/wobble'
import { cn } from '../../lib/cn'

// 0 = plain translucent caramel; 1 = diagonal stripes, 2 = dotted (both global utils)
const VARIANT_CLASS = ['bg-caramel/70', 'tape-stripes', 'tape-dots'] as const

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
      className={cn(
        'pointer-events-none absolute h-6.5 opacity-[0.82] mix-blend-multiply',
        VARIANT_CLASS[variant],
        className,
      )}
      style={{ width: length, transform: `rotate(${rotation}deg)`, clipPath, ...style }}
      aria-hidden="true"
    />
  )
}
