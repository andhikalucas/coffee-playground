import { PersonaPopup, PopupRow } from '../components/persona/PersonaPopup'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { ART } from '../art/registry'
import type { PlaygroundItem } from './items'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { useSfx } from '../audio/useSfx'
import styles from './playground.module.css'

interface ItemPopupProps {
  item: PlaygroundItem
  onClose: () => void
}

/** The Persona card for one coffee thing. */
export function ItemPopup({ item, onClose }: ItemPopupProps) {
  const Art = ART[item.art]
  const { applySeed } = useRecipes()
  const { goTo } = useScene()
  const play = useSfx()

  const useInRecipe = () => {
    applySeed(item.recipeSeed)
    play('ding')
    onClose()
    goTo('maker')
  }

  return (
    <PersonaPopup popupKey={`item-${item.id}`} onClose={onClose} labelledBy={`popup-title-${item.id}`} width={620}>
      <PopupRow>
        <div id={`popup-title-${item.id}`}>
          <PersonaTitle text={item.name} seed={item.id} />
        </div>
      </PopupRow>
      <PopupRow>
        <div className={styles.popupBody}>
          <div className={styles.popupArt}>
            <Art />
          </div>
          <div className={styles.popupText}>
            <p className={styles.blurb}>{item.blurb}</p>
            <WobblyFrame seed={`fact-${item.id}`} fill="var(--foam)" padding="12px 16px">
              <span className={styles.factTag}>fun fact</span>
              <p className={styles.factText}>{item.funFact}</p>
            </WobblyFrame>
          </div>
        </div>
      </PopupRow>
      <PopupRow>
        <div className={styles.popupActions}>
          <WobblyButton variant="red" seed={`use-${item.id}`} onClick={useInRecipe}>
            use in a recipe →
          </WobblyButton>
          <WobblyButton variant="ghost" seed={`ok-${item.id}`} onClick={onClose}>
            neat.
          </WobblyButton>
        </div>
      </PopupRow>
    </PersonaPopup>
  )
}
