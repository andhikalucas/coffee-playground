import { PersonaPopup, PopupRow } from '../components/persona/PersonaPopup'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { ART } from '../art/registry'
import type { PlaygroundItem } from './items'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import { useSfx } from '../audio/useSfx'

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
    <PersonaPopup
      popupKey={`item-${item.id}`}
      onClose={onClose}
      labelledBy={`popup-title-${item.id}`}
      width={620}
    >
      <PopupRow>
        {/* keep the heading clear of the pinned ✕ chip in the top-right corner */}
        <div id={`popup-title-${item.id}`} className="pr-10">
          <PersonaTitle text={item.name} seed={item.id} />
        </div>
      </PopupRow>
      <PopupRow>
        <div className="flex items-start gap-5 max-[760px]:flex-col max-[760px]:items-center">
          <div className="-mt-1.5 h-42 w-42 flex-none *:h-full *:w-full *:object-contain">
            <Art />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <p className="rotate-[-0.6deg] font-script text-[1.45rem] leading-[1.25] text-ink">
              {item.blurb}
            </p>
            <WobblyFrame seed={`fact-${item.id}`} fill="var(--foam)" padding="12px 16px">
              <span className="mb-1.5 inline-block -rotate-2 bg-ink px-2.5 pt-0.75 pb-0.5 font-display text-[0.78rem] uppercase tracking-[0.08em] text-foam">
                fun fact
              </span>
              <p className="text-[0.98rem] leading-[1.45] text-ink-soft">{item.funFact}</p>
            </WobblyFrame>
          </div>
        </div>
      </PopupRow>
      <PopupRow>
        <div className="flex flex-wrap items-center gap-4 pt-1">
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
