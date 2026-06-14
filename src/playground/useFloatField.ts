import { useCallback, useEffect, useMemo } from 'react'
import { motionValue, useAnimationFrame } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { rngFrom } from '../lib/rng'
import type { PlaygroundItem } from './items'

export const BASE_SIZE = 120
const PAD_X = 90
const PAD_Y = 100
const REPULSION = 0.045
// keep drift items legible on phones: never render smaller than ~120px (7.5rem at
// a 16px root, i.e. Tailwind w-30). Below the `sm` breakpoint we step the size
// down once rather than shrinking continuously.
const MIN_SIZE = 120
const SM = 640

export interface FloatHandle {
  x: MotionValue<number>
  y: MotionValue<number>
  rotate: MotionValue<number>
  /** home position as fractions of the usable field */
  home: { fx: number; fy: number }
  phases: [number, number, number]
  amps: [number, number, number]
  freqs: [number, number, number]
  size: number
  dragging: boolean
}

export interface FloatField {
  handles: Map<string, FloatHandle>
  /** effective rendered size for a handle (px), floored at MIN_SIZE */
  sizeOf: (h: FloatHandle) => number
  startDrag: (id: string) => void
  endDrag: (id: string) => void
}

interface FieldOpts {
  active: boolean
  reducedMotion: boolean
  width: number
  height: number
}

/**
 * One rAF loop drives every drifting item by writing MotionValues directly —
 * zero React re-renders at 60fps. Items bob on seeded sine waves around
 * "home" points; homes gently repel each other so nothing overlaps; dragging
 * an item re-homes it wherever it's dropped.
 */
export function useFloatField(items: PlaygroundItem[], opts: FieldOpts): FloatField {
  const { active, reducedMotion, width, height } = opts

  // items keep their natural size at/above `sm`; below it they step down once
  // (not continuously) and are floored at MIN_SIZE via `sizeOf`. The edge padding
  // still tightens on small fields so items spread rather than pile up.
  const scale = width >= SM || width < 10 ? 1 : 0.88
  const padX = width < 10 ? PAD_X : Math.min(PAD_X, Math.max(30, width * 0.1))
  const padY = height < 10 ? PAD_Y : Math.min(PAD_Y, Math.max(44, height * 0.1))

  const sizeOf = useCallback((h: FloatHandle) => Math.max(MIN_SIZE, h.size * scale), [scale])

  // recreated only if the items array identity changes (it's a module
  // constant today) — dragged positions reset in that case, which beats
  // silently rendering nothing for new items
  const handles = useMemo(() => {
    const map = new Map<string, FloatHandle>()
    const cols = 3
    const rows = Math.ceil(items.length / cols)
    items.forEach((item, i) => {
      const rand = rngFrom(item.id + ':float')
      const col = i % cols
      const row = Math.floor(i / cols)
      map.set(item.id, {
        x: motionValue(0),
        y: motionValue(0),
        rotate: motionValue(0),
        home: {
          fx: (col + 0.5) / cols + (rand() * 2 - 1) * 0.07,
          fy: (row + 0.5) / rows + (rand() * 2 - 1) * 0.06,
        },
        phases: [rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2],
        amps: [10 + rand() * 7, 13 + rand() * 8, 3.5 + rand() * 3],
        freqs: [0.45 * (0.85 + rand() * 0.4), 0.62 * (0.85 + rand() * 0.4), 0.35 * (0.85 + rand() * 0.4)],
        size: BASE_SIZE * item.size,
        dragging: false,
      })
    })
    return map
  }, [items])

  const usable = useCallback(
    (axis: 'x' | 'y', size: number) =>
      axis === 'x' ? Math.max(1, width - padX * 2 - size) : Math.max(1, height - padY * 2 - size),
    [width, height, padX, padY],
  )

  const homePx = useCallback(
    (h: FloatHandle) => {
      const s = sizeOf(h)
      return {
        x: padX + h.home.fx * usable('x', s),
        y: padY + h.home.fy * usable('y', s),
      }
    },
    [usable, padX, padY, sizeOf],
  )

  // settle items onto their homes whenever the field can't animate
  // (first paint, reduced motion, or menu mode)
  useEffect(() => {
    if (width < 10 || height < 10) return
    if (active && !reducedMotion) return
    handles.forEach((h) => {
      const p = homePx(h)
      h.x.set(p.x)
      h.y.set(p.y)
      h.rotate.set((h.phases[2] - Math.PI) * 1.6)
    })
  }, [active, reducedMotion, width, height, handles, homePx])

  useAnimationFrame((ms) => {
    if (!active || reducedMotion || width < 10 || height < 10) return
    const t = ms / 1000

    // soft repulsion between home points (n=9 → pairs are free)
    const list = [...handles.values()]
    for (let a = 0; a < list.length; a++) {
      for (let b = a + 1; b < list.length; b++) {
        const ha = list[a]
        const hb = list[b]
        if (ha.dragging || hb.dragging) continue
        const sa = sizeOf(ha)
        const sb = sizeOf(hb)
        const pa = homePx(ha)
        const pb = homePx(hb)
        const cxA = pa.x + sa / 2
        const cyA = pa.y + sa / 2
        const cxB = pb.x + sb / 2
        const cyB = pb.y + sb / 2
        const dx = cxB - cxA
        const dy = cyB - cyA
        const dist = Math.hypot(dx, dy) || 1
        const minDist = (sa + sb) * 0.52 + 8
        if (dist < minDist) {
          const push = (minDist - dist) * REPULSION
          const ux = dx / dist
          const uy = dy / dist
          ha.home.fx = clamp01(ha.home.fx - (ux * push) / usable('x', sa))
          ha.home.fy = clamp01(ha.home.fy - (uy * push) / usable('y', sa))
          hb.home.fx = clamp01(hb.home.fx + (ux * push) / usable('x', sb))
          hb.home.fy = clamp01(hb.home.fy + (uy * push) / usable('y', sb))
        }
      }
    }

    handles.forEach((h) => {
      if (h.dragging) return
      const p = homePx(h)
      h.x.set(p.x + Math.sin(t * h.freqs[0] + h.phases[0]) * h.amps[0])
      h.y.set(p.y + Math.sin(t * h.freqs[1] + h.phases[1]) * h.amps[1])
      h.rotate.set(Math.sin(t * h.freqs[2] + h.phases[2]) * h.amps[2])
    })
  })

  return useMemo(
    () => ({
      handles,
      sizeOf,
      startDrag: (id: string) => {
        const h = handles.get(id)
        if (h) h.dragging = true
      },
      endDrag: (id: string) => {
        const h = handles.get(id)
        if (!h) return
        // the item lives where you left it
        const s = sizeOf(h)
        h.home.fx = clamp01((h.x.get() - padX) / usable('x', s))
        h.home.fy = clamp01((h.y.get() - padY) / usable('y', s))
        h.dragging = false
      },
    }),
    [handles, usable, sizeOf, padX, padY],
  )
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}
