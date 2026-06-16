import type { Bean } from './types'
import { BEAN_STATUSES } from './types'
import type { BrewMethod } from '../state/types'
import { BREW_METHODS, uid } from '../state/types'
import { num, str, oneOf, isObj } from '../state/normalize'

/**
 * Beans are loaded from bundled JSON (CMS-edited), so the same untrusted-input
 * discipline as normalizeRecipe applies: clamp numbers, validate enums, drop
 * junk. A malformed entry degrades to sensible defaults rather than crashing.
 */
export function normalizeBean(u: unknown): Bean | null {
  if (!isObj(u)) return null
  return {
    id: str(u.id, uid(), 64),
    name: str(u.name, 'mystery beans', 80),
    roaster: str(u.roaster, '', 80),
    origin: str(u.origin, '', 80),
    process: str(u.process, '', 60),
    roastLevel: Math.round(num(u.roastLevel, 3, 1, 5)),
    tastingNotes: Array.isArray(u.tastingNotes)
      ? u.tastingNotes
          .filter((s): s is string => typeof s === 'string')
          .map((s) => s.slice(0, 40))
          .slice(0, 8)
      : [],
    rating: num(u.rating, 0, 0, 5),
    brewMethods: Array.isArray(u.brewMethods)
      ? u.brewMethods.filter((m): m is BrewMethod =>
          (BREW_METHODS as readonly string[]).includes(m as string),
        )
      : [],
    status: oneOf(u.status, BEAN_STATUSES, 'in-the-cupboard'),
    blurb: str(u.blurb, '', 240),
    boughtAt: typeof u.boughtAt === 'string' ? u.boughtAt.slice(0, 40) : undefined,
    price: typeof u.price === 'string' ? u.price.slice(0, 40) : undefined,
    recipeId: typeof u.recipeId === 'string' ? u.recipeId.slice(0, 80) : undefined,
  }
}
