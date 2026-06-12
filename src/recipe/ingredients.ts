import type { IngredientKind, RecipeIngredient } from '../state/types'

export function ingredientName(ing: RecipeIngredient): string {
  if (ing.kind === 'other') return ing.label || 'something special'
  const names: Record<Exclude<IngredientKind, 'other'>, string> = {
    coffee: 'coffee',
    water: 'water',
    milk: 'milk',
    ice: 'ice',
  }
  return names[ing.kind]
}
