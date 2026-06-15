import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { isHouseRecipe } from '../state/types'
import { HOUSE_RECIPES } from '../content/houseRecipes'
import { PinnedCard } from './PinnedCard'
import { CardFocus } from './CardFocus'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { ART } from '../art/registry'

type BoardFilter = 'house' | 'mine' | 'all'

const FILTERS: Array<{ id: BoardFilter; label: string }> = [
  { id: 'house', label: "lucas' recipes" },
  { id: 'mine', label: 'yours' },
  { id: 'all', label: 'all' },
]

const GRID =
  'grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] justify-items-center gap-x-7.5 gap-y-11 px-9.5 pt-6 pb-12 max-[768px]:gap-x-3 max-[768px]:gap-y-6 max-[768px]:px-3 max-[768px]:pt-4 max-[768px]:pb-9'
const HEADING =
  "px-9.5 pt-7 font-script text-[1.55rem] text-foam [text-shadow:1.5px_2px_0_rgba(42,27,16,0.4)] max-[768px]:px-3"

/** The corkboard: lucas' curated recipes first, then whatever you've pinned. */
export function GalleryScene() {
  const { recipes } = useRecipes()
  const { goTo } = useScene()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<BoardFilter>('house')

  const house = HOUSE_RECIPES
  const focused = [...house, ...recipes].find((r) => r.id === focusedId) ?? null
  const CupArt = ART.cup

  const showHouse = filter === 'house' || filter === 'all'
  const showMine = filter === 'mine' || filter === 'all'

  return (
    <>
      <div className="absolute inset-[70px_26px_26px] overflow-x-hidden overflow-y-auto cork-board scrollable max-[1024px]:inset-[58px_12px_84px]">
        <div
          className="sticky top-0 z-20 flex flex-wrap items-center justify-center gap-2.5 border-b border-kraft-deep/40 bg-cork/85 px-4 py-2.5 backdrop-blur-[2px]"
          role="group"
          aria-label="filter the board"
        >
          {FILTERS.map((f) => (
            <WobblyButton
              key={f.id}
              seed={`board-filter-${f.id}`}
              variant={filter === f.id ? 'ink' : 'paper'}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </WobblyButton>
          ))}
        </div>

        {showHouse && (
          <section aria-label="lucas' recipes">
            <h2 className={HEADING}>lucas' recipes</h2>
            {house.length > 0 ? (
              <div className={GRID}>
                {house.map((recipe) => (
                  <PinnedCard key={recipe.id} recipe={recipe} onOpen={setFocusedId} house />
                ))}
              </div>
            ) : (
              <p className={`${HEADING} pb-8 text-[1.3rem] opacity-90`}>
                lucas hasn't shelved any recipes yet
              </p>
            )}
          </section>
        )}

        {showMine && (
          <section aria-label="pinned by you">
            <h2 className={HEADING}>pinned by you</h2>
            {recipes.length > 0 ? (
              <div className={GRID}>
                {recipes.map((recipe) => (
                  <PinnedCard key={recipe.id} recipe={recipe} onOpen={setFocusedId} />
                ))}
              </div>
            ) : (
              <div className="grid place-content-center justify-items-center gap-4 px-7.5 py-12 text-center">
                <div className="h-28 w-28 opacity-[0.92] *:h-full *:w-full *:object-contain">
                  <CupArt />
                </div>
                <p className="max-w-[340px] rotate-[-1.4deg] font-script text-[1.4rem] text-foam [text-shadow:1.5px_2px_0_rgba(42,27,16,0.4)]">
                  nothing pinned yet — the board is hungry for your first recipe
                </p>
                <WobblyButton seed="empty-make" variant="red" onClick={() => goTo('maker')}>
                  make the first one →
                </WobblyButton>
              </div>
            )}
          </section>
        )}
      </div>

      <AnimatePresence>
        {focused && (
          <CardFocus
            recipe={focused}
            house={isHouseRecipe(focused)}
            onClose={() => setFocusedId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
