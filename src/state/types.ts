export type SceneId = 'playground' | 'maker' | 'gallery' | 'cupboard'

/* value lists double as runtime validators for data coming out of localStorage */
export const BREW_METHODS = ['v60', 'espresso', 'moka', 'french-press', 'cold-brew'] as const
export const PAPER_STYLES = ['lined', 'grid', 'kraft', 'dotted'] as const
export const INK_COLORS = ['espresso', 'navy', 'red', 'forest'] as const
export const INGREDIENT_KINDS = ['coffee', 'water', 'milk', 'ice', 'other'] as const
export const GRIND_SIZES = ['fine', 'medium-fine', 'medium', 'medium-coarse', 'coarse'] as const
export const STICKER_IDS_ALL = ['heart', 'star', 'steam', 'bean', 'ring', 'sparkle', 'mug'] as const

export type BrewMethod = (typeof BREW_METHODS)[number]
export type PaperStyle = (typeof PAPER_STYLES)[number]
export type InkColor = (typeof INK_COLORS)[number]
export type IngredientKind = (typeof INGREDIENT_KINDS)[number]
export type GrindSize = (typeof GRIND_SIZES)[number]
export type StickerId = (typeof STICKER_IDS_ALL)[number]

export interface RecipeIngredient {
  id: string
  kind: IngredientKind
  /** display name; only used when kind === 'other' */
  label?: string
  amount: number
  unit: 'g' | 'ml'
}

export interface BrewParams {
  tempC?: number
  grind?: GrindSize
  timeSec?: number
}

/** Sticker x/y are fractions of the card (0..1) so cards scale anywhere. */
export interface StickerPlacement {
  id: string
  stickerId: StickerId
  x: number
  y: number
  rotation: number
  scale: number
}

export interface TapePlacement {
  id: string
  x: number
  y: number
  rotation: number
  length: number
  variant: 0 | 1 | 2
}

export interface RecipeDecor {
  paper: PaperStyle
  ink: InkColor
  stickers: StickerPlacement[]
  tapes: TapePlacement[]
}

export interface Recipe {
  id: string
  title: string
  method: BrewMethod
  ingredients: RecipeIngredient[]
  params: BrewParams
  steps: string[]
  decor: RecipeDecor
  /** corkboard presentation, generated once when first saved */
  pin: { angle: number; color: string }
  createdAt: number
  updatedAt: number
}

/**
 * Owner-curated "house" recipes are loaded from bundled JSON, not the vault.
 * We tag them with an id prefix instead of a wrapper type so they flow through
 * every Recipe-typed component unchanged — and can never be accidentally
 * persisted to or deleted from a visitor's localStorage.
 */
export const HOUSE_ID_PREFIX = 'house:'
export const isHouseRecipe = (r: Recipe): boolean => r.id.startsWith(HOUSE_ID_PREFIX)

/** What a playground item pre-fills into the recipe maker. */
export interface RecipeSeed {
  method?: BrewMethod
  ingredients?: Array<Omit<RecipeIngredient, 'id'>>
  params?: BrewParams
  titleHint?: string
}

export interface VaultSettings {
  muted: boolean
  volume: number
}

export interface Vault {
  version: 1
  recipes: Recipe[]
  draft: Recipe | null
  settings: VaultSettings
}

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}`

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
  v60: 'V60',
  espresso: 'espresso',
  moka: 'moka pot',
  'french-press': 'french press',
  'cold-brew': 'cold brew',
}

export function emptyRecipe(): Recipe {
  const now = Date.now()
  return {
    id: uid(),
    title: '',
    method: 'v60',
    ingredients: [
      { id: uid(), kind: 'coffee', amount: 15, unit: 'g' },
      { id: uid(), kind: 'water', amount: 240, unit: 'ml' },
    ],
    params: { tempC: 93, grind: 'medium' },
    steps: ['bloom the grounds, wait 30s…'],
    decor: { paper: 'lined', ink: 'espresso', stickers: [], tapes: [] },
    pin: { angle: 0, color: '#e0341e' },
    createdAt: now,
    updatedAt: now,
  }
}
