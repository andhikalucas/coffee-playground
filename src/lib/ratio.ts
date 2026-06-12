import type { RecipeIngredient } from '../state/types'

/**
 * Coffee-to-water brew ratio, the number coffee folks actually care about.
 * Water in ml counts as grams (1ml ≈ 1g). Returns e.g. "1:15", or null
 * when there isn't both coffee and water on the card yet.
 */
export function brewRatio(ingredients: RecipeIngredient[]): string | null {
  let coffee = 0
  let water = 0
  for (const ing of ingredients) {
    if (!Number.isFinite(ing.amount) || ing.amount <= 0) continue
    if (ing.kind === 'coffee') coffee += ing.amount
    if (ing.kind === 'water') water += ing.amount
  }
  if (coffee <= 0 || water <= 0) return null
  const r = water / coffee
  const shown = r >= 10 ? Math.round(r) : Math.round(r * 10) / 10
  return `1:${shown}`
}
