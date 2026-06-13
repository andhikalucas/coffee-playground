import { useId, useMemo } from 'react'
import { wobblyLinePath } from '../../lib/wobble'
import { useElementSize } from '../../hooks/useElementSize'
import { cn } from '../../lib/cn'

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
    <div ref={ref} className={cn('relative h-2.5 w-full', className)} aria-hidden="true">
      {d && (
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${width} 10`}
          preserveAspectRatio="none"
        >
          <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
