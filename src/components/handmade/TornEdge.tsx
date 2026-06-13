import { useId, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { tornEdgePolygon } from '../../lib/wobble'
import type { TornEdges } from '../../lib/wobble'
import { useElementSize } from '../../hooks/useElementSize'
import { cn } from '../../lib/cn'

interface TornEdgeProps {
  children?: ReactNode
  edges?: TornEdges | 'all'
  seed?: string
  tooth?: number
  depth?: number
  /** wraps in a drop-shadow layer that follows the torn silhouette */
  shadow?: boolean
  className?: string
  style?: CSSProperties
}

/** Clips its contents to a torn-paper silhouette. */
export function TornEdge({
  children,
  edges = 'all',
  seed,
  tooth = 10,
  depth = 5,
  shadow = false,
  className,
  style,
}: TornEdgeProps) {
  const autoId = useId()
  const [ref, { width, height }] = useElementSize()

  const clipPath = useMemo(
    () =>
      width > 4 && height > 4
        ? tornEdgePolygon(width, height, edges, { seed: seed ?? autoId, tooth, depth })
        : undefined,
    [width, height, edges, seed, autoId, tooth, depth],
  )

  const core = (
    <div ref={ref} className={cn('relative', className)} style={{ clipPath, ...style }}>
      {children}
    </div>
  )

  return shadow ? <div className="drop-shadow-[3px_4px_0_rgba(42,27,16,0.18)]">{core}</div> : core
}
