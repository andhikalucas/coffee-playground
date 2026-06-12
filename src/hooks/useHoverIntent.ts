import { useCallback, useEffect, useRef, useState } from 'react'

const hoverCapable = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

/**
 * Delayed hover for desktop pointers — fires only after the cursor settles,
 * so drifting items don't pop while you sweep across the playground.
 * On touch devices it never fires (tap handles focus instead).
 */
export function useHoverIntent(delayMs = 180) {
  const [hovered, setHovered] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const clear = useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  const onPointerEnter = useCallback(() => {
    if (!hoverCapable) return
    clear()
    timer.current = window.setTimeout(() => setHovered(true), delayMs)
  }, [clear, delayMs])

  const onPointerLeave = useCallback(() => {
    clear()
    setHovered(false)
  }, [clear])

  /** Call when a drag starts etc. — cancels pending + active hover. */
  const cancel = useCallback(() => {
    clear()
    setHovered(false)
  }, [clear])

  useEffect(() => clear, [clear])

  return { hovered, onPointerEnter, onPointerLeave, cancel }
}
