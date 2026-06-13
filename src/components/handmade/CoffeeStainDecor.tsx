import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { wobblyEllipsePath } from '../../lib/wobble'
import { rngFrom } from '../../lib/rng'
import { cn } from '../../lib/cn'

interface CoffeeStainDecorProps {
  size?: number
  seed?: string
  color?: string
  opacity?: number
  className?: string
  style?: CSSProperties
}

/** A faint ring left by a careless mug. Sprinkle on backgrounds. */
export function CoffeeStainDecor({
  size = 120,
  seed = 'stain',
  color = 'var(--roast)',
  opacity = 0.14,
  className,
  style,
}: CoffeeStainDecorProps) {
  const parts = useMemo(() => {
    const r = size / 2
    const rand = rngFrom(seed + ':drops')
    const drops = Array.from({ length: 3 }, (_, i) => ({
      cx: r + (rand() * 2 - 1) * r * 0.95,
      cy: r + (rand() * 2 - 1) * r * 0.95,
      r: 1.5 + rand() * 3,
      key: i,
    }))
    return {
      outer: wobblyEllipsePath(r, r, r * 0.82, r * 0.78, { seed: seed + ':o', amplitude: size * 0.02 }),
      inner: wobblyEllipsePath(r, r, r * 0.7, r * 0.66, { seed: seed + ':i', amplitude: size * 0.015 }),
      drops,
    }
  }, [size, seed])

  return (
    <svg
      className={cn('pointer-events-none absolute', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      <path d={parts.outer} fill="none" stroke={color} strokeWidth={size * 0.045} strokeLinecap="round" />
      <path
        d={parts.inner}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.02}
        strokeDasharray={`${size * 0.3} ${size * 0.12}`}
        strokeLinecap="round"
      />
      {parts.drops.map((d) => (
        <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} fill={color} />
      ))}
    </svg>
  )
}
