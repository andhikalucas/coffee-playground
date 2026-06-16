import type { BrewMethod } from '../state/types'

export const BEAN_STATUSES = ['in-the-cupboard', 'finished', 'want-again'] as const
export type BeanStatus = (typeof BEAN_STATUSES)[number]

export const BEAN_STATUS_LABELS: Record<BeanStatus, string> = {
  'in-the-cupboard': 'in the cupboard',
  finished: 'finished',
  'want-again': 'want again',
}

/** One coffee lucas has tried — an owner-curated cupboard entry (read-only). */
export interface Bean {
  id: string
  name: string
  roaster: string
  origin: string
  process: string
  /** 1 (light) … 5 (dark) — drives the roast gauge */
  roastLevel: number
  tastingNotes: string[]
  /** 0 … 5, half-steps allowed */
  rating: number
  brewMethods: BrewMethod[]
  status: BeanStatus
  blurb: string
  boughtAt?: string
  price?: string
  /** optional cross-link to a house recipe id, e.g. "house:weekend-moka" */
  recipeId?: string
}
