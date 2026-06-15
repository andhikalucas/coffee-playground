import type { Recipe } from '../state/types'
import { normalizeRecipe } from '../state/normalize'
import { slug } from './slug'

/**
 * JSON authoring path for recipes. Export lets the owner build a card visually
 * then drop it into the house-recipes collection; import lets anyone load a
 * `.json` back as a draft. All untrusted text goes through normalizeRecipe, so
 * a malformed file degrades to null instead of crashing.
 */

/** Pretty-printed JSON for a recipe — diff-friendly and CMS-editable. */
export function recipeToJson(recipe: Recipe): string {
  return JSON.stringify(recipe, null, 2)
}

/** Trigger a browser download of a recipe as `<title>.json`. */
export function downloadRecipeJson(recipe: Recipe): void {
  const blob = new Blob([recipeToJson(recipe)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug(recipe.title)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Parse + sanitize untrusted JSON text into a Recipe; null if it isn't one. */
export function parseRecipeJson(text: string): Recipe | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  return normalizeRecipe(parsed)
}

/** Read a picked file as text (File.text() is supported across target browsers). */
export function readFileAsText(file: File): Promise<string> {
  return file.text()
}
