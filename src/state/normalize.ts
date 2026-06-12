import type { Recipe, RecipeIngredient, StickerPlacement, TapePlacement, Vault } from './types'
import {
  BREW_METHODS,
  GRIND_SIZES,
  INGREDIENT_KINDS,
  INK_COLORS,
  PAPER_STYLES,
  STICKER_IDS_ALL,
  emptyRecipe,
  uid,
} from './types'

/**
 * localStorage contents are user-editable (and survive old app versions), so
 * nothing below the top level can be trusted. Everything loaded passes
 * through here: bad fields fall back to sane defaults, unknown sticker ids
 * are dropped instead of crashing the render, numbers are definanced.
 */

const num = (v: unknown, fallback: number, min: number, max: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback

const optNum = (v: unknown, min: number, max: number): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : undefined

const str = (v: unknown, fallback: string, maxLen: number): string =>
  typeof v === 'string' ? v.slice(0, maxLen) : fallback

const oneOf = <T extends string>(v: unknown, values: readonly T[], fallback: T): T =>
  typeof v === 'string' && (values as readonly string[]).includes(v) ? (v as T) : fallback

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

function normalizeIngredient(u: unknown): RecipeIngredient | null {
  if (!isObj(u)) return null
  return {
    id: str(u.id, uid(), 64),
    kind: oneOf(u.kind, INGREDIENT_KINDS, 'other'),
    label: typeof u.label === 'string' ? u.label.slice(0, 40) : undefined,
    amount: num(u.amount, 0, 0, 100000),
    unit: u.unit === 'ml' ? 'ml' : 'g',
  }
}

function normalizeSticker(u: unknown): StickerPlacement | null {
  if (!isObj(u)) return null
  if (typeof u.stickerId !== 'string' || !(STICKER_IDS_ALL as readonly string[]).includes(u.stickerId)) {
    return null // unknown sticker (removed from the registry?) — drop, don't crash
  }
  return {
    id: str(u.id, uid(), 64),
    stickerId: u.stickerId as StickerPlacement['stickerId'],
    x: num(u.x, 0.5, -0.1, 1.1),
    y: num(u.y, 0.5, -0.1, 1.1),
    rotation: num(u.rotation, 0, -360, 360),
    scale: num(u.scale, 1, 0.4, 2.5),
  }
}

function normalizeTape(u: unknown): TapePlacement | null {
  if (!isObj(u)) return null
  const variant = u.variant === 1 || u.variant === 2 ? u.variant : 0
  return {
    id: str(u.id, uid(), 64),
    x: num(u.x, 0.5, -0.1, 1.1),
    y: num(u.y, 0.5, -0.1, 1.1),
    rotation: num(u.rotation, 0, -360, 360),
    length: num(u.length, 110, 40, 260),
    variant,
  }
}

export function normalizeRecipe(u: unknown): Recipe | null {
  if (!isObj(u)) return null
  const base = emptyRecipe()
  const decor = isObj(u.decor) ? u.decor : {}
  const params = isObj(u.params) ? u.params : {}
  const pin = isObj(u.pin) ? u.pin : {}
  return {
    id: str(u.id, base.id, 64),
    title: str(u.title, '', 60),
    method: oneOf(u.method, BREW_METHODS, 'v60'),
    ingredients: Array.isArray(u.ingredients)
      ? u.ingredients.map(normalizeIngredient).filter((i): i is RecipeIngredient => i !== null)
      : [],
    params: {
      tempC: optNum(params.tempC, 0, 100),
      grind:
        typeof params.grind === 'string' && (GRIND_SIZES as readonly string[]).includes(params.grind)
          ? (params.grind as Recipe['params']['grind'])
          : undefined,
      timeSec: optNum(params.timeSec, 1, 60 * 60 * 24),
    },
    steps: Array.isArray(u.steps)
      ? u.steps.filter((s): s is string => typeof s === 'string').map((s) => s.slice(0, 280))
      : [],
    decor: {
      paper: oneOf(decor.paper, PAPER_STYLES, 'lined'),
      ink: oneOf(decor.ink, INK_COLORS, 'espresso'),
      stickers: Array.isArray(decor.stickers)
        ? decor.stickers.map(normalizeSticker).filter((s): s is StickerPlacement => s !== null)
        : [],
      tapes: Array.isArray(decor.tapes)
        ? decor.tapes.map(normalizeTape).filter((t): t is TapePlacement => t !== null)
        : [],
    },
    pin: {
      angle: num(pin.angle, 0, -10, 10),
      color: typeof pin.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(pin.color) ? pin.color : '#e0341e',
    },
    createdAt: num(u.createdAt, Date.now(), 0, 8.64e15),
    updatedAt: num(u.updatedAt, Date.now(), 0, 8.64e15),
  }
}

/** Coerce a parsed (but otherwise untrusted) vault into a guaranteed-good one. */
export function normalizeVault(u: unknown): Vault {
  const obj = isObj(u) ? u : {}
  const settings = isObj(obj.settings) ? obj.settings : {}
  return {
    version: 1,
    recipes: Array.isArray(obj.recipes)
      ? obj.recipes.map(normalizeRecipe).filter((r): r is Recipe => r !== null)
      : [],
    draft: obj.draft ? normalizeRecipe(obj.draft) : null,
    settings: {
      muted: settings.muted === true,
      volume: num(settings.volume, 0.7, 0, 1),
    },
  }
}
