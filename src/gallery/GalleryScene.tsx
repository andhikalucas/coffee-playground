import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { PinnedCard } from './PinnedCard'
import { CardFocus } from './CardFocus'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { ART } from '../art/registry'

/** The corkboard where finished cards live. */
export function GalleryScene() {
  const { recipes } = useRecipes()
  const { goTo } = useScene()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const focused = recipes.find((r) => r.id === focusedId) ?? null
  const CupArt = ART.cup

  return (
    <>
      <div className="absolute inset-[70px_26px_26px] overflow-x-hidden overflow-y-auto cork-board scrollable">
        {recipes.length === 0 ? (
          <div className="grid h-full place-content-center justify-items-center gap-4.5 p-7.5 text-center">
            <div className="h-37.5 w-37.5 opacity-[0.92] *:h-full *:w-full *:object-contain">
              <CupArt />
            </div>
            <p className="max-w-[340px] rotate-[-1.4deg] font-script text-[1.55rem] text-foam [text-shadow:1.5px_2px_0_rgba(42,27,16,0.4)]">
              nothing pinned yet — the board is hungry for your first recipe
            </p>
            <WobblyButton seed="empty-make" variant="red" onClick={() => goTo('maker')}>
              make the first one →
            </WobblyButton>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] justify-items-center gap-x-7.5 gap-y-11 px-9.5 pt-11 pb-15">
            {recipes.map((recipe) => (
              <PinnedCard key={recipe.id} recipe={recipe} onOpen={setFocusedId} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {focused && <CardFocus recipe={focused} onClose={() => setFocusedId(null)} />}
      </AnimatePresence>
    </>
  )
}
