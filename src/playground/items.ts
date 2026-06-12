import type { ArtId } from '../art/registry'
import type { RecipeSeed } from '../state/types'

export interface PlaygroundItem {
  id: string
  name: string
  art: ArtId
  /** one-line personality */
  blurb: string
  funFact: string
  /** what "use in a recipe →" pre-fills */
  recipeSeed: RecipeSeed
  /** relative footprint in the float field */
  size: number
}

export const ITEMS: PlaygroundItem[] = [
  {
    id: 'beans',
    name: 'the beans',
    art: 'beans',
    blurb: 'freshly roasted, smelling like a good decision.',
    funFact:
      'coffee beans aren’t beans at all — they’re the pits of a cherry. during roasting they crack audibly, like tiny popcorn, and roasters listen for "first crack" to judge the roast.',
    recipeSeed: {
      ingredients: [{ kind: 'coffee', amount: 18, unit: 'g' }],
      titleHint: 'fresh bean something',
    },
    size: 1,
  },
  {
    id: 'espresso-machine',
    name: 'espresso machine',
    art: 'espresso-machine',
    blurb: 'nine bars of pressure and a bit of a diva.',
    funFact:
      'espresso is brewed at ~9 bars — about three times the pressure in a car tire — pushed through coffee ground nearly as fine as flour, in under 30 seconds.',
    recipeSeed: {
      method: 'espresso',
      ingredients: [
        { kind: 'coffee', amount: 18, unit: 'g' },
        { kind: 'water', amount: 36, unit: 'g' },
      ],
      params: { tempC: 93, grind: 'fine', timeSec: 28 },
      titleHint: 'a proper shot',
    },
    size: 1.25,
  },
  {
    id: 'moka-pot',
    name: 'moka pot',
    art: 'moka-pot',
    blurb: 'the little stovetop rocket from 1933.',
    funFact:
      'the moka pot’s eight-sided shape has barely changed since alfonso bialetti designed it in 1933 — and the official advice is to never wash it with soap, just rinse.',
    recipeSeed: {
      method: 'moka',
      ingredients: [
        { kind: 'coffee', amount: 16, unit: 'g' },
        { kind: 'water', amount: 200, unit: 'ml' },
      ],
      params: { grind: 'medium-fine' },
      titleHint: 'stovetop sunday',
    },
    size: 1.1,
  },
  {
    id: 'v60',
    name: 'v60 dripper',
    art: 'v60',
    blurb: 'a cone, a filter, and a lot of opinions.',
    funFact:
      'the v60 is named for its 60° cone angle. its spiral ridges let the paper breathe so water flows through the bed evenly — geometry doing the barista’s job.',
    recipeSeed: {
      method: 'v60',
      ingredients: [
        { kind: 'coffee', amount: 15, unit: 'g' },
        { kind: 'water', amount: 225, unit: 'g' },
      ],
      params: { tempC: 93, grind: 'medium-fine', timeSec: 165 },
      titleHint: 'slow morning pour',
    },
    size: 1.1,
  },
  {
    id: 'kettle',
    name: 'gooseneck kettle',
    art: 'kettle',
    blurb: 'pours water like it’s writing calligraphy.',
    funFact:
      'water just off the boil (90–96°C) extracts best — a rolling 100°C scalds delicate notes. the goose’s long neck is really a flow restrictor for slow, precise spirals.',
    recipeSeed: {
      params: { tempC: 92 },
      titleHint: 'kettle ritual',
    },
    size: 1.05,
  },
  {
    id: 'milk-pitcher',
    name: 'milk pitcher',
    art: 'milk-pitcher',
    blurb: 'where milk learns to be velvet.',
    funFact:
      'steamed milk is a foam of micro-bubbles too small to see — baristas chase "wet paint" texture. the hiss at the start is air stretching the milk; the whirlpool polishes it.',
    recipeSeed: {
      ingredients: [{ kind: 'milk', amount: 120, unit: 'ml' }],
      titleHint: 'something milky',
    },
    size: 1,
  },
  {
    id: 'grinder',
    name: 'hand grinder',
    art: 'grinder',
    blurb: 'breakfast and a workout, simultaneously.',
    funFact:
      'grind size is the biggest brewing lever you own: finer = more surface = faster extraction. a burr grinder crushes evenly; blade grinders make "coffee confetti" — some dust, some boulders.',
    recipeSeed: {
      params: { grind: 'medium' },
      titleHint: 'fresh-ground anything',
    },
    size: 1.05,
  },
  {
    id: 'cup',
    name: 'the good cup',
    art: 'cup',
    blurb: 'the one that makes coffee taste 12% better.',
    funFact:
      'latte art only holds because espresso crema and micro-foamed milk have nearly the same density — the pattern floats. the heart is the first shape every barista learns (and keeps practicing).',
    recipeSeed: {
      ingredients: [{ kind: 'milk', amount: 150, unit: 'ml' }],
      titleHint: 'for the good cup',
    },
    size: 0.95,
  },
  {
    id: 'bean-bag',
    name: 'bag of beans',
    art: 'bean-bag',
    blurb: 'single origin. the origin is the kitchen shelf.',
    funFact:
      'fresh-roasted beans exhale CO₂ for days — that’s why bags have one-way valves and why super-fresh coffee "blooms" into a bubbly dome when hot water first hits it.',
    recipeSeed: {
      ingredients: [{ kind: 'coffee', amount: 20, unit: 'g' }],
      titleHint: 'new bag, who dis',
    },
    size: 1.1,
  },
]
