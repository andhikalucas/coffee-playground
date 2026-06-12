import { useLayoutEffect, useRef, useState } from 'react'

export interface ElementSize {
  width: number
  height: number
}

/**
 * Border-box size of an element, live via ResizeObserver.
 * Used by the wobble components to draw ink at the element's real pixel size.
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setSize((prev) =>
        Math.abs(prev.width - rect.width) < 0.5 && Math.abs(prev.height - rect.height) < 0.5
          ? prev
          : { width: rect.width, height: rect.height },
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}
