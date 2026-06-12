import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { PinnedCard } from './PinnedCard'
import { CardFocus } from './CardFocus'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { ART } from '../art/registry'
import styles from './gallery.module.css'

/** The corkboard where finished cards live. */
export function GalleryScene() {
  const { recipes } = useRecipes()
  const { goTo } = useScene()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const focused = recipes.find((r) => r.id === focusedId) ?? null
  const CupArt = ART.cup

  return (
    <>
      <div className={`${styles.corkWrap} scrollable`}>
        {recipes.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyArt}>
              <CupArt />
            </div>
            <p className={styles.emptyText}>nothing pinned yet — the board is hungry for your first recipe</p>
            <WobblyButton seed="empty-make" variant="red" onClick={() => goTo('maker')}>
              make the first one →
            </WobblyButton>
          </div>
        ) : (
          <div className={styles.boardGrid}>
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
