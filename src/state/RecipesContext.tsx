import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Recipe, RecipeSeed } from './types'
import { emptyRecipe, uid } from './types'
import { loadVault, updateVault } from '../lib/storage'
import { seededRange, seededPick } from '../lib/rng'
import { PALETTE } from '../styles/tokens'

interface RecipesValue {
  recipes: Recipe[]
  draft: Recipe
  /** true when the draft has never been touched (safe to overwrite by a seed) */
  updateDraft: (mutate: (d: Recipe) => void) => void
  newDraft: () => void
  saveDraft: () => Recipe
  editRecipe: (id: string) => void
  deleteRecipe: (id: string) => void
  applySeed: (seed: RecipeSeed) => void
}

const RecipesContext = createContext<RecipesValue | null>(null)

const PIN_COLORS = [PALETTE.red, PALETTE.caramel, PALETTE.navy, PALETTE.forest]

function clone(r: Recipe): Recipe {
  return JSON.parse(JSON.stringify(r)) as Recipe
}

export function RecipesProvider({ children }: { children: ReactNode }) {
  const vault = loadVault()
  const [recipes, setRecipes] = useState<Recipe[]>(vault.recipes)
  const [draft, setDraft] = useState<Recipe>(() => vault.draft ?? emptyRecipe())

  const persistDraft = useCallback((d: Recipe | null) => {
    updateVault((v) => {
      v.draft = d ? clone(d) : null
    })
  }, [])

  const updateDraft = useCallback(
    (mutate: (d: Recipe) => void) => {
      setDraft((prev) => {
        const next = clone(prev)
        mutate(next)
        next.updatedAt = Date.now()
        persistDraft(next)
        return next
      })
    },
    [persistDraft],
  )

  const newDraft = useCallback(() => {
    const fresh = emptyRecipe()
    setDraft(fresh)
    persistDraft(fresh)
  }, [persistDraft])

  const saveDraft = useCallback((): Recipe => {
    const saved = clone(draft)
    saved.updatedAt = Date.now()
    if (!saved.title.trim()) saved.title = 'untitled brew'
    // corkboard presentation decided once, deterministically per recipe
    saved.pin = {
      angle: seededRange(saved.id, -5, 5),
      color: seededPick(saved.id, PIN_COLORS),
    }
    setRecipes((prev) => {
      const i = prev.findIndex((r) => r.id === saved.id)
      const next = i >= 0 ? [...prev.slice(0, i), saved, ...prev.slice(i + 1)] : [...prev, saved]
      updateVault((v) => {
        v.recipes = next
      })
      return next
    })
    const fresh = emptyRecipe()
    setDraft(fresh)
    persistDraft(fresh)
    return saved
  }, [draft, persistDraft])

  const editRecipe = useCallback(
    (id: string) => {
      const found = recipes.find((r) => r.id === id)
      if (!found) return
      const copy = clone(found)
      setDraft(copy)
      persistDraft(copy)
    },
    [recipes, persistDraft],
  )

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id)
      updateVault((v) => {
        v.recipes = next
      })
      return next
    })
  }, [])

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
    () => ({ recipes, draft, updateDraft, newDraft, saveDraft, editRecipe, deleteRecipe, applySeed }),
    [recipes, draft, updateDraft, newDraft, saveDraft, editRecipe, deleteRecipe, applySeed],
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes(): RecipesValue {
  const v = useContext(RecipesContext)
  if (!v) throw new Error('useRecipes outside RecipesProvider')
  return v
}
