import { useRef, useState } from 'react'
import { useRecipes } from '../state/RecipesContext'
import { useScene } from '../state/SceneContext'
import type { RecipeDecor } from '../state/types'
import { IndexCard } from './IndexCard'
import { CardEditor } from './CardEditor'
import { StickerShelf } from './StickerShelf'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { showToast } from '../components/handmade/Toast'
import { useSfx } from '../audio/useSfx'
import { flushVault } from '../lib/storage'
import styles from './recipe.module.css'

type Tab = 'write' | 'decorate'

/** Write a recipe on the card, then flip to decorate mode and go wild. */
export function RecipeMakerScene() {
  const { draft, saveDraft, newDraft } = useRecipes()
  const { goTo } = useScene()
  const play = useSfx()
  const [tab, setTab] = useState<Tab>('write')
  const [selectedDecor, setSelectedDecor] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const { updateDraft } = useRecipes()

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
    <div className={styles.makerWrap}>
      <div className={styles.deskGlow} aria-hidden="true" />

      <div className={styles.modeTabs} role="tablist" aria-label="card mode">
        <WobblyButton
          seed="tab-write"
          variant={tab === 'write' ? 'ink' : 'paper'}
          role="tab"
          aria-selected={tab === 'write'}
          onClick={() => setTab('write')}
        >
          ✎ write
        </WobblyButton>
        <WobblyButton
          seed="tab-decorate"
          variant={tab === 'decorate' ? 'ink' : 'paper'}
          role="tab"
          aria-selected={tab === 'decorate'}
          onClick={() => setTab('decorate')}
        >
          ✿ decorate
        </WobblyButton>
      </div>

      <div className={`${styles.stage} scrollable`}>
        <div className={styles.cardHolder} style={{ rotate: '-0.8deg' }}>
          <IndexCard
            recipe={draft}
            mode={tab === 'write' ? 'edit' : 'decorate'}
            editor={<CardEditor />}
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

      <aside className={`${styles.sideCol} scrollable`}>
        {tab === 'decorate' ? (
          <StickerShelf onAdded={setSelectedDecor} />
        ) : (
          <WobblyFrame seed="write-tips" fill="var(--paper-deep)" padding={18}>
            <div className={styles.shelfPanel}>
              <span className={styles.shelfTitle}>scribble away</span>
              <p className={styles.shelfHint}>
                everything on the card is editable — name it, tweak the numbers, swap the method stamp. the
                ratio badge keeps count of coffee : water as you go.
              </p>
              <p className={styles.shelfHint}>
                when it reads right, flip to <strong>✿ decorate</strong> for stickers and tape.
              </p>
            </div>
          </WobblyFrame>
        )}

        <div className={styles.actionCol}>
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
