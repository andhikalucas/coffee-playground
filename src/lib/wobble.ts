import { rngFrom } from './rng'

/**
 * The hand-inked line engine. Every "drawn" border, divider and ring in the
 * app comes from these generators. All randomness is seeded — the same seed
 * always draws the same wobble, so nothing shimmers across re-renders.
 */

export interface WobbleOptions {
  seed?: string
  /** max jitter in px applied to each sampled point */
  amplitude?: number
  /** distance in px between sampled points along the shape */
  segment?: number
}

interface Pt {
  x: number
  y: number
}

const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
const fx = (n: number) => n.toFixed(2)

/** Smooth a closed ring of points with quadratic curves through midpoints. */
function smoothClosed(pts: Pt[]): string {
  const n = pts.length
  const start = mid(pts[n - 1], pts[0])
  let d = `M ${fx(start.x)} ${fx(start.y)}`
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n])
    d += ` Q ${fx(pts[i].x)} ${fx(pts[i].y)} ${fx(m.x)} ${fx(m.y)}`
  }
  return d + ' Z'
}

/** Smooth an open run of points the same way. */
function smoothOpen(pts: Pt[]): string {
  if (pts.length < 2) return ''
  let d = `M ${fx(pts[0].x)} ${fx(pts[0].y)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = mid(pts[i], pts[i + 1])
    d += ` Q ${fx(pts[i].x)} ${fx(pts[i].y)} ${fx(m.x)} ${fx(m.y)}`
  }
  const last = pts[pts.length - 1]
  d += ` L ${fx(last.x)} ${fx(last.y)}`
  return d
}

/** A hand-drawn rectangle outline (SVG path `d`), origin at 0,0. */
export function wobblyRectPath(w: number, h: number, opts: WobbleOptions = {}): string {
  const { seed = 'rect', amplitude = 2.2, segment = 16 } = opts
  const rand = rngFrom(seed)
  const j = () => (rand() * 2 - 1) * amplitude
  const pts: Pt[] = []
  const edge = (x1: number, y1: number, x2: number, y2: number) => {
    const steps = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / segment))
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      pts.push({ x: x1 + (x2 - x1) * t + j(), y: y1 + (y2 - y1) * t + j() })
    }
  }
  edge(0, 0, w, 0)
  edge(w, 0, w, h)
  edge(w, h, 0, h)
  edge(0, h, 0, 0)
  return smoothClosed(pts)
}

/** A hand-drawn line between two points (SVG path `d`). */
export function wobblyLinePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: WobbleOptions = {},
): string {
  const { seed = 'line', amplitude = 1.8, segment = 14 } = opts
  const rand = rngFrom(seed)
  const j = () => (rand() * 2 - 1) * amplitude
  const steps = Math.max(3, Math.round(Math.hypot(x2 - x1, y2 - y1) / segment))
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // pin the endpoints so lines meet what they underline
    const wobble = i === 0 || i === steps ? 0.4 : 1
    pts.push({
      x: x1 + (x2 - x1) * t + j() * wobble,
      y: y1 + (y2 - y1) * t + j() * wobble,
    })
  }
  return smoothOpen(pts)
}

/** A hand-drawn ellipse outline (SVG path `d`). */
export function wobblyEllipsePath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  opts: WobbleOptions = {},
): string {
  const { seed = 'ellipse', amplitude = 2, segment = 14 } = opts
  const rand = rngFrom(seed)
  const circumference = Math.PI * (rx + ry)
  const steps = Math.max(8, Math.round(circumference / segment))
  const pts: Pt[] = []
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const r = 1 + ((rand() * 2 - 1) * amplitude) / Math.max(rx, ry)
    pts.push({ x: cx + Math.cos(a) * rx * r, y: cy + Math.sin(a) * ry * r })
  }
  return smoothClosed(pts)
}

export interface TornEdges {
  top?: boolean
  right?: boolean
  bottom?: boolean
  left?: boolean
}

export interface TornOptions {
  seed?: string
  /** approximate px between teeth */
  tooth?: number
  /** how deep the tear bites, in px */
  depth?: number
}

/**
 * A torn-paper `polygon(...)` string (percentages) for `clip-path`.
 * Straight edges stay straight; torn edges get jittered teeth biting inward.
 */
export function tornEdgePolygon(
  w: number,
  h: number,
  edges: TornEdges | 'all',
  opts: TornOptions = {},
): string {
  const { seed = 'torn', tooth = 10, depth = 5 } = opts
  const torn: TornEdges = edges === 'all' ? { top: true, right: true, bottom: true, left: true } : edges
  const rand = rngFrom(seed)
  const pts: Pt[] = []

  const walk = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isTorn: boolean,
    nx: number,
    ny: number, // inward normal
  ) => {
    if (!isTorn) {
      pts.push({ x: x1, y: y1 })
      return
    }
    const len = Math.hypot(x2 - x1, y2 - y1)
    const steps = Math.max(3, Math.round(len / tooth))
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const bite = rand() * depth
      pts.push({
        x: x1 + (x2 - x1) * t + nx * bite,
        y: y1 + (y2 - y1) * t + ny * bite,
      })
    }
  }

  walk(0, 0, w, 0, !!torn.top, 0, 1)
  walk(w, 0, w, h, !!torn.right, -1, 0)
  walk(w, h, 0, h, !!torn.bottom, 0, -1)
  walk(0, h, 0, 0, !!torn.left, 1, 0)

  const coords = pts
    .map((p) => `${((p.x / w) * 100).toFixed(2)}% ${((p.y / h) * 100).toFixed(2)}%`)
    .join(', ')
  return `polygon(${coords})`
}
