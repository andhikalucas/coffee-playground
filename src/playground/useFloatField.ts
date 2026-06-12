import { useEffect, useMemo } from 'react'
import { motionValue, useAnimationFrame } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { rngFrom } from '../lib/rng'
import type { PlaygroundItem } from './items'

export const BASE_SIZE = 120
const PAD_X = 90
const PAD_Y = 100
const REPULSION = 0.045

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
    // items catalog is static for the app's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const usable = (axis: 'x' | 'y', size: number) =>
    axis === 'x' ? Math.max(1, width - PAD_X * 2 - size) : Math.max(1, height - PAD_Y * 2 - size)

  const homePx = (h: FloatHandle) => ({
    x: PAD_X + h.home.fx * usable('x', h.size),
    y: PAD_Y + h.home.fy * usable('y', h.size),
  })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion, width, height, handles])

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
        const pa = homePx(ha)
        const pb = homePx(hb)
        const cxA = pa.x + ha.size / 2
        const cyA = pa.y + ha.size / 2
        const cxB = pb.x + hb.size / 2
        const cyB = pb.y + hb.size / 2
        const dx = cxB - cxA
        const dy = cyB - cyA
        const dist = Math.hypot(dx, dy) || 1
        const minDist = (ha.size + hb.size) * 0.52 + 8
        if (dist < minDist) {
          const push = (minDist - dist) * REPULSION
          const ux = dx / dist
          const uy = dy / dist
          ha.home.fx = clamp01(ha.home.fx - (ux * push) / usable('x', ha.size))
          ha.home.fy = clamp01(ha.home.fy - (uy * push) / usable('y', ha.size))
          hb.home.fx = clamp01(hb.home.fx + (ux * push) / usable('x', hb.size))
          hb.home.fy = clamp01(hb.home.fy + (uy * push) / usable('y', hb.size))
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
      startDrag: (id: string) => {
        const h = handles.get(id)
        if (h) h.dragging = true
      },
      endDrag: (id: string) => {
        const h = handles.get(id)
        if (!h) return
        // the item lives where you left it
        h.home.fx = clamp01((h.x.get() - PAD_X) / usable('x', h.size))
        h.home.fy = clamp01((h.y.get() - PAD_Y) / usable('y', h.size))
        h.dragging = false
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handles, width, height],
  )
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}
