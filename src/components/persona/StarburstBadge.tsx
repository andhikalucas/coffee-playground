import { useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { rngFrom } from '../../lib/rng'
import styles from './persona.module.css'

interface StarburstBadgeProps {
  children: ReactNode
  size?: number
  color?: string
  seed?: string
  fontSize?: string
  className?: string
  style?: CSSProperties
}

/** A spiky little stamp — ratio numbers, "new!", anything that deserves a shout. */
export function StarburstBadge({
  children,
  size = 92,
  color = 'var(--red)',
  seed = 'badge',
  fontSize = '1.15rem',
  className,
  style,
}: StarburstBadgeProps) {
  const points = useMemo(() => {
    const rand = rngFrom(seed)
    const spikes = 12
    const R = size / 2
    const pts: string[] = []
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const r = i % 2 === 0 ? R * (0.88 + rand() * 0.14) : R * (0.58 + rand() * 0.1)
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [seed, size])

  return (
    <span className={`${styles.badge} ${className ?? ''}`} style={{ width: size, height: size, ...style }}>
      <svg
        className={styles.badgeSvg}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        aria-hidden="true"
      >
        <polygon points={points} fill={color} stroke="var(--ink)" strokeWidth={2} />
      </svg>
      <span className={styles.badgeLabel} style={{ fontSize }}>
        {children}
      </span>
    </span>
  )
}
