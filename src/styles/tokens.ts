import { seededRange } from '../lib/rng'

/** Palette mirrored from global.css for SVG fills and inline styles. */
export const PALETTE = {
  paper: '#f6eedd',
  paperDeep: '#efe3cc',
  foam: '#fff9ef',
  ink: '#2a1b10',
  inkSoft: '#5b4633',
  inkFaint: '#8a7560',
  caramel: '#c98a3d',
  caramelSoft: '#e3b878',
  kraft: '#d9c29a',
  kraftDeep: '#c4a878',
  roast: '#7a4b22',
  cork: '#c9a06b',
  red: '#e0341e',
  redDeep: '#b02513',
  navy: '#2b3a55',
  forest: '#3d5a3c',
} as const

/**
 * Deterministic small rotation for "nothing is perfectly straight".
 * Same seed → same tilt, every render, every visit.
 */
export function tilt(seed: string, max = 2): number {
  return seededRange(seed + ':tilt', -max, max)
}
