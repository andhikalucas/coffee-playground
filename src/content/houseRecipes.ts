import type { Recipe } from '../state/types'
import { HOUSE_ID_PREFIX } from '../state/types'
import { normalizeRecipe } from '../state/normalize'
import { seededRange, seededPick } from '../lib/rng'
import { PALETTE } from '../styles/tokens'

/**
 * Owner-curated recipes shipped in the repo and edited via the CMS. One JSON
 * file = one recipe; the filename becomes a stable `house:<slug>` id so these
 * never collide with — or get persisted alongside — a visitor's localStorage
 * recipes. Everything is run through normalizeRecipe so a malformed CMS edit
 * degrades to a dropped card instead of crashing the board.
 *
 * Eager glob bundles the collection at build time (fine at hobby scale; if it
 * grows large, switch to a lazy glob with a loading state).
 */
const PIN_COLORS = [PALETTE.red, PALETTE.caramel, PALETTE.navy, PALETTE.forest]

const modules = import.meta.glob('./house-recipes/*.json', { eager: true })

export const HOUSE_RECIPES: Recipe[] = Object.entries(modules)
  .map(([path, mod]): Recipe | null => {
    const recipe = normalizeRecipe((mod as { default: unknown }).default)
    if (!recipe) return null
    const slug = path.split('/').pop()!.replace(/\.json$/, '')
    const id = `${HOUSE_ID_PREFIX}${slug}`
    // deterministic corkboard presentation, same idiom as saveDraft()
    return { ...recipe, id, pin: { angle: seededRange(id, -5, 5), color: seededPick(id, PIN_COLORS) } }
  })
  .filter((r): r is Recipe => r !== null)
  .sort((a, b) => a.title.localeCompare(b.title))
