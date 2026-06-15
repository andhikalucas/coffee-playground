import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Recipe, RecipeSeed } from './types'
import { emptyRecipe, uid } from './types'
import { normalizeRecipe } from './normalize'
import { loadVault, updateVault } from '../lib/storage'
import { seededRange, seededPick } from '../lib/rng'
import { PALETTE } from '../styles/tokens'

interface RecipesValue {
  recipes: Recipe[]
  draft: Recipe
  updateDraft: (mutate: (d: Recipe) => void) => void
  newDraft: () => void
  loadDraft: (recipe: Recipe) => void
  saveDraft: () => Recipe
  editRecipe: (id: string) => void
  deleteRecipe: (id: string) => void
  applySeed: (seed: RecipeSeed) => void
}

const RecipesContext = createContext<RecipesValue | null>(null)

const PIN_COLORS = [PALETTE.red, PALETTE.caramel, PALETTE.navy, PALETTE.forest]

/** JSON round-trip: cheap deep clone; NaN becomes null, which normalize cleans up on save/load. */
function clone(r: Recipe): Recipe {
  return JSON.parse(JSON.stringify(r)) as Recipe
}

export function RecipesProvider({ children }: { children: ReactNode }) {
  const vault = loadVault()
  const [recipes, setRecipes] = useState<Recipe[]>(vault.recipes)
  const [draft, setDraft] = useState<Recipe>(() => vault.draft ?? emptyRecipe())

  // persistence is reactive so state updaters stay pure (StrictMode-safe);
  // the debounced write plus the pagehide flush cover tab closes
  useEffect(() => {
    updateVault((v) => {
      v.draft = clone(draft)
    })
  }, [draft])

  const updateDraft = useCallback((mutate: (d: Recipe) => void) => {
    setDraft((prev) => {
      const next = clone(prev)
      mutate(next)
      next.updatedAt = Date.now()
      return next
    })
  }, [])

  const newDraft = useCallback(() => {
    setDraft(emptyRecipe())
  }, [])

  // load a whole recipe (imported JSON, or a forked house recipe) as the draft.
  // re-normalized so externally-authored objects can't smuggle in bad fields;
  // keeps the id so saveDraft upserts rather than duplicating.
  const loadDraft = useCallback((recipe: Recipe) => {
    setDraft(normalizeRecipe(clone(recipe)) ?? emptyRecipe())
  }, [])

  const saveDraft = useCallback((): Recipe => {
    // normalize scrubs anything the editor let through (NaN amounts → 0 etc.)
    const saved = normalizeRecipe(clone(draft)) ?? emptyRecipe()
    saved.updatedAt = Date.now()
    if (!saved.title.trim()) saved.title = 'untitled brew'
    // corkboard presentation decided once, deterministically per recipe
    saved.pin = {
      angle: seededRange(saved.id, -5, 5),
      color: seededPick(saved.id, PIN_COLORS),
    }
    const i = recipes.findIndex((r) => r.id === saved.id)
    const next = i >= 0 ? [...recipes.slice(0, i), saved, ...recipes.slice(i + 1)] : [...recipes, saved]
    setRecipes(next)
    // mutates the in-memory vault synchronously, so a flushVault() right after
    // this call genuinely writes the new recipe to disk
    updateVault((v) => {
      v.recipes = next
    })
    setDraft(emptyRecipe())
    return saved
  }, [draft, recipes])

  const editRecipe = useCallback(
    (id: string) => {
      const found = recipes.find((r) => r.id === id)
      if (found) setDraft(clone(found))
    },
    [recipes],
  )

  const deleteRecipe = useCallback(
    (id: string) => {
      const next = recipes.filter((r) => r.id !== id)
      setRecipes(next)
      updateVault((v) => {
        v.recipes = next
      })
    },
    [recipes],
  )

  const applySeed = useCallback(
    (seed: RecipeSeed) => {
      updateDraft((d) => {
        if (seed.method) d.method = seed.method
        if (seed.titleHint && !d.title.trim()) d.title = seed.titleHint
        if (seed.params) d.params = { ...d.params, ...seed.params }
        for (const ing of seed.ingredients ?? []) {
          const existing = d.ingredients.find((e) => e.kind === ing.kind && ing.kind !== 'other')
          if (existing) {
            existing.amount = ing.amount
            existing.unit = ing.unit
          } else {
            d.ingredients.push({ ...ing, id: uid() })
          }
        }
      })
    },
    [updateDraft],
  )

  const value = useMemo(
    () => ({ recipes, draft, updateDraft, newDraft, loadDraft, saveDraft, editRecipe, deleteRecipe, applySeed }),
    [recipes, draft, updateDraft, newDraft, loadDraft, saveDraft, editRecipe, deleteRecipe, applySeed],
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hooks co-located with their provider is the idiom here
export function useRecipes(): RecipesValue {
  const v = useContext(RecipesContext)
  if (!v) throw new Error('useRecipes outside RecipesProvider')
  return v
}
