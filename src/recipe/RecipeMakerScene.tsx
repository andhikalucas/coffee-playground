import { useRef, useState } from 'react'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import type { RecipeDecor } from '../state/types'
import { IndexCard } from './IndexCard'
import { CardEditor } from './CardEditor'
import { StickerShelf } from './StickerShelf'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { WobblyUnderline } from '../components/handmade/WobblyUnderline'
import { showToast } from '../components/handmade/toastBus'
import { useSfx } from '../audio/useSfx'
import { flushVault } from '../lib/storage'

type Tab = 'write' | 'decorate'

const SHELF_PANEL = 'flex flex-col gap-3.5'
const SHELF_TITLE = 'font-script text-[1.35rem] font-bold'
const SHELF_HINT = 'font-hand text-[0.85rem] leading-[1.45] text-ink-faint'

/** Write a recipe on the card, then flip to decorate mode and go wild. */
export function RecipeMakerScene() {
  const { draft, saveDraft, newDraft, updateDraft } = useRecipes()
  const { goTo } = useScene()
  const play = useSfx()
  const [tab, setTab] = useState<Tab>('write')
  const [selectedDecor, setSelectedDecor] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const updateDecor = (mutate: (d: RecipeDecor) => void) => updateDraft((d) => mutate(d.decor))

  const pinIt = () => {
    saveDraft()
    flushVault()
    play('ding')
    showToast('pinned to the board ♡')
    goTo('gallery')
  }

  const startOver = () => {
    play('swish')
    newDraft()
    setSelectedDecor(null)
    showToast('fresh card!')
  }

  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_300px] gap-6 overflow-hidden px-9 pt-21.5 pb-10 max-[1024px]:grid-cols-1 max-[1024px]:grid-rows-[1fr_auto] max-[1024px]:pt-19.5">
      <div className="pointer-events-none absolute inset-0 bg-desk-glow" aria-hidden="true" />

      <div
        className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 gap-2.5"
        role="group"
        aria-label="card mode"
      >
        <WobblyButton
          seed="tab-write"
          variant={tab === 'write' ? 'ink' : 'paper'}
          aria-pressed={tab === 'write'}
          onClick={() => setTab('write')}
        >
          ✎ write
        </WobblyButton>
        <WobblyButton
          seed="tab-decorate"
          variant={tab === 'decorate' ? 'ink' : 'paper'}
          aria-pressed={tab === 'decorate'}
          onClick={() => setTab('decorate')}
        >
          ✿ decorate
        </WobblyButton>
      </div>

      <div className="flex items-start justify-center overflow-y-auto px-2.5 pt-7.5 pb-15 scrollable max-[1024px]:order-0">
        <div
          className="flex-none origin-top max-[1180px]:scale-85 max-[1024px]:scale-78"
          style={{ rotate: '-0.8deg' }}
        >
          <IndexCard
            recipe={draft}
            mode={tab === 'write' ? 'edit' : 'decorate'}
            editor={<CardEditor key={draft.id} />}
            cardRef={cardRef}
            decorate={{
              selectedId: selectedDecor,
              onSelect: setSelectedDecor,
              updateDecor,
              cardRef,
            }}
          />
        </div>
      </div>

      <aside className="flex flex-col gap-4 pt-1 pr-1.5 pb-7.5 pl-0.5 max-[1024px]:order-1 max-[1024px]:max-h-[260px] max-[1024px]:flex-row max-[1024px]:items-start max-[1024px]:overflow-x-auto">
        {tab === 'decorate' ? (
          <StickerShelf onAdded={setSelectedDecor} />
        ) : (
          <WobblyFrame seed="write-tips" fill="var(--paper-deep)" padding={18}>
            <div className={SHELF_PANEL}>
              <span className={SHELF_TITLE}>
                <WobblyUnderline seed="tips-underline">scribble away</WobblyUnderline>
              </span>
              <p className={SHELF_HINT}>
                everything on the card is editable — name it, tweak the numbers, swap the method stamp. the
                ratio badge keeps count of coffee : water as you go.
              </p>
              <p className={SHELF_HINT}>
                when it reads right, flip to <strong>✿ decorate</strong> for stickers and tape.
              </p>
            </div>
          </WobblyFrame>
        )}

        <div className="flex flex-col items-stretch gap-3">
          <WobblyButton seed="pin-it" variant="red" onClick={pinIt}>
            📌 pin it to the board
          </WobblyButton>
          <WobblyButton seed="start-over" variant="ghost" onClick={startOver}>
            fresh card
          </WobblyButton>
        </div>
      </aside>
    </div>
  )
}
