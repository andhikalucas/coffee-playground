import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRecipes } from '../state/RecipesContext'
import { useElementSize } from '../hooks/useElementSize'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScene } from '../state/SceneContext'
import type { RecipeDecor } from '../state/types'
import { IndexCard } from './IndexCard'
import { CardEditor } from './CardEditor'
import { StickerShelf } from './StickerShelf'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { WobblyUnderline } from '../components/handmade/WobblyUnderline'
import { StickerPickerSheet } from './StickerPickerSheet'
import { showToast } from '../components/handmade/toastBus'
import { useSfx } from '../audio/useSfx'
import { flushVault } from '../lib/storage'
import { parseRecipeJson, readFileAsText } from '../lib/recipeJson'

type Tab = 'write' | 'decorate'

const SHELF_PANEL = 'flex flex-col gap-3.5'
const SHELF_TITLE = 'font-script text-[1.35rem] font-bold'
const SHELF_HINT = 'font-hand text-[0.85rem] leading-[1.45] text-ink-faint'

/** Write a recipe on the card, then flip to decorate mode and go wild. */
export function RecipeMakerScene() {
  const { draft, saveDraft, newDraft, updateDraft, loadDraft } = useRecipes()
  const { goTo } = useScene()
  const play = useSfx()
  const [tab, setTab] = useState<Tab>('write')
  const [selectedDecor, setSelectedDecor] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // On phones the inline decoration drawer ate more than half the screen and
  // crowded the recipe, so there it collapses to a button that opens the drawer
  // in a popup; tablets/desktop keep the side panel.
  const isPhone = useMediaQuery('(max-width: 768px)')

  // The card is designed at a fixed 640px width. Rather than a fixed ladder of
  // breakpoint scales (which left phones at ~0.4× and the writing barely legible),
  // measure the column and scale the card to fill it — capped at 1× so it never
  // grows past its design size on desktop. Bigger card ⇒ bigger, readable text.
  const [fitRef, { width: fitW }] = useElementSize<HTMLDivElement>()
  const cardFit = fitW > 0 ? Math.min(1, (fitW - 18) / 640) : 1

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

  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // reset so picking the same file again still fires onChange
    if (!file) return
    const parsed = parseRecipeJson(await readFileAsText(file))
    if (!parsed) {
      showToast("that file didn't look like a recipe")
      return
    }
    loadDraft(parsed)
    setTab('write')
    play('ding')
    showToast('loaded — tweak and pin it ♡')
  }

  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_300px] gap-6 overflow-hidden px-9 pt-21.5 pb-10 max-[1024px]:grid-cols-1 max-[1024px]:grid-rows-[1fr_auto] max-[1024px]:gap-3 max-[1024px]:px-3 max-[1024px]:pt-19.5 max-[1024px]:pb-24 max-[768px]:px-2">
      <div className="pointer-events-none absolute inset-0 bg-desk-glow" aria-hidden="true" />

      {/* top-centre on roomy screens; moves to the top-right once the washi nav
          drops to the bottom bar (≤1024px), keeping its full text label */}
      <div
        className="absolute left-1/2 top-5.5 z-10 flex -translate-x-1/2 gap-2.5 max-[1024px]:left-auto max-[1024px]:right-4.5 max-[1024px]:translate-x-0"
        role="group"
        aria-label="card mode"
      >
        <WobblyButton
          seed="tab-write"
          variant={tab === 'write' ? 'ink' : 'paper'}
          aria-pressed={tab === 'write'}
          onClick={() => {
            setTab('write')
            setPickerOpen(false)
          }}
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

      <div
        ref={fitRef}
        className="flex items-start justify-center overflow-y-auto px-2.5 pt-7.5 pb-15 scrollable max-[1024px]:order-0 max-[768px]:px-1.5"
      >
        <div
          className="flex-none origin-top"
          style={{ scale: cardFit, rotate: '-0.8deg' }}
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

      <aside className="flex flex-col gap-4 pt-1 pr-1.5 pb-7.5 pl-0.5 max-[1024px]:order-1">
        {/* on phones the drawer scrolls vertically inside a capped height so the
            pin/fresh actions below stay put instead of being pushed off-screen */}
        <div className="min-h-0 scrollable max-[1024px]:max-h-[44vh] max-[1024px]:overflow-y-auto max-[1024px]:pr-1">
          {tab === 'decorate' ? (
            isPhone ? (
              <WobblyButton
                seed="open-drawer"
                variant="ink"
                className="w-full"
                onClick={() => setPickerOpen(true)}
              >
                🎨 open the sticker drawer
              </WobblyButton>
            ) : (
              <StickerShelf onAdded={setSelectedDecor} />
            )
          ) : (
            <WobblyFrame
              seed="write-tips"
              fill="var(--paper-deep)"
              padding={18}
              className="max-[768px]:mx-auto max-[768px]:max-w-md"
            >
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
        </div>

        <div className="flex flex-col items-stretch gap-3">
          <WobblyButton seed="pin-it" variant="red" onClick={pinIt}>
            📌 pin it to the board
          </WobblyButton>
          <WobblyButton seed="start-over" variant="ghost" onClick={startOver}>
            fresh card
          </WobblyButton>
          <WobblyButton
            seed="import-json"
            variant="paper"
            onClick={() => fileInputRef.current?.click()}
          >
            ⇪ import a recipe
          </WobblyButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            aria-label="import a recipe from a json file"
            className="hidden"
            onChange={onImportFile}
          />
        </div>
      </aside>

      {/* phones: the drawer opens as a popup so it never crowds the recipe.
          picking a sticker/tape closes it (the piece lands selected on the card,
          ready to drag); ink/paper apply live and keep it open. */}
      <AnimatePresence>
        {isPhone && tab === 'decorate' && pickerOpen && (
          <StickerPickerSheet onClose={() => setPickerOpen(false)} labelledBy="sticker-picker-title">
            <span id="sticker-picker-title" className="sr-only">
              decoration drawer
            </span>
            <StickerShelf onAdded={setSelectedDecor} onPlaced={() => setPickerOpen(false)} />
          </StickerPickerSheet>
        )}
      </AnimatePresence>
    </div>
  )
}
