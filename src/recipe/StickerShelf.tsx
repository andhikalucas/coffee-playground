import { useRecipes } from '../state/RecipesContext'
import type { InkColor, PaperStyle, StickerId } from '../state/types'
import { uid } from '../state/types'
import { STICKERS, STICKER_IDS } from '../art/stickers/registry'
import { PAPERS, INKS } from './papers'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { useSfx } from '../audio/useSfx'
import { cn } from '../lib/cn'

const SHELF_TITLE = 'font-script text-[1.35rem] font-bold'
const STICKER_BTN =
  'grid aspect-square place-items-center rounded-[18px_6px_16px_8px/8px_16px_6px_18px] border-2 border-solid border-ink bg-foam p-1.5 hover:-rotate-3 hover:scale-[1.07] hover:bg-paper [&_svg]:h-full [&_svg]:w-full'
const TAPE_BTN =
  'relative h-8.5 flex-1 overflow-hidden rounded-[8px_14px_6px_12px/12px_6px_14px_8px] border-2 border-solid border-ink hover:-rotate-2 hover:scale-[1.05]'
const INK_CHIP = 'relative h-7.5 w-7.5 rounded-[50%_44%_52%_48%] border-[2.4px] border-solid border-ink'
const INK_CHIP_CHECK =
  "after:absolute after:inset-0 after:grid after:place-items-center after:text-[0.85rem] after:text-foam after:content-['✓']"
const PAPER_SWATCH =
  'relative h-8.5 w-11 overflow-hidden rounded-[8px_4px_10px_5px/5px_10px_4px_8px] border-[2.2px] border-solid border-ink'
const PAPER_SWATCH_ACTIVE = 'outline outline-[3px] outline-offset-2 outline-red'

interface StickerShelfProps {
  onAdded: (id: string) => void
}

/** The decoration drawer: stickers, tape, ink, paper. */
export function StickerShelf({ onAdded }: StickerShelfProps) {
  const { draft, updateDraft } = useRecipes()
  const play = useSfx()

  const addSticker = (stickerId: StickerId) => {
    const id = uid()
    play('thump')
    updateDraft((d) =>
      d.decor.stickers.push({
        id,
        stickerId,
        x: 0.5 + (Math.random() - 0.5) * 0.14,
        y: 0.5 + (Math.random() - 0.5) * 0.14,
        rotation: Math.round((Math.random() - 0.5) * 28),
        scale: 1,
      }),
    )
    onAdded(id)
  }

  const addTape = (variant: 0 | 1 | 2) => {
    const id = uid()
    play('thump')
    updateDraft((d) =>
      d.decor.tapes.push({
        id,
        x: 0.5 + (Math.random() - 0.5) * 0.2,
        y: Math.random() < 0.5 ? 0.04 : 0.96,
        rotation: Math.round((Math.random() - 0.5) * 36),
        length: 100 + Math.round(Math.random() * 50),
        variant,
      }),
    )
    onAdded(id)
  }

  return (
    <WobblyFrame seed="sticker-shelf" fill="var(--paper-deep)" padding={18}>
      <div className="flex flex-col gap-3.5">
        <span className={SHELF_TITLE}>sticker drawer</span>
        <div className="grid grid-cols-4 gap-2">
          {STICKER_IDS.map((sid) => {
            const def = STICKERS[sid]
            const Doodle = def.Component
            return (
              <button
                key={sid}
                type="button"
                className={STICKER_BTN}
                onClick={() => addSticker(sid)}
                aria-label={`add ${def.label} sticker`}
                title={def.label}
              >
                <Doodle />
              </button>
            )
          })}
        </div>

        <span className={SHELF_TITLE}>washi tape</span>
        <div className="flex gap-2">
          {([0, 1, 2] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              className={TAPE_BTN}
              onClick={() => addTape(variant)}
              aria-label={`add tape strip ${variant + 1}`}
            >
              <span
                className="absolute inset-[4px_6px]"
                style={{
                  background:
                    variant === 0
                      ? 'rgba(201, 138, 61, 0.7)'
                      : variant === 1
                        ? 'repeating-linear-gradient(45deg, rgba(224,52,30,.55) 0 7px, rgba(255,249,239,.65) 7px 14px)'
                        : 'radial-gradient(rgba(42,27,16,.4) 1.4px, transparent 1.5px) 0 0 / 8px 8px rgba(255,249,239,.75)',
                }}
              />
            </button>
          ))}
        </div>

        <span className={SHELF_TITLE}>ink</span>
        <div className="flex items-center gap-2" role="radiogroup" aria-label="handwriting ink">
          {(Object.keys(INKS) as InkColor[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={draft.decor.ink === k}
              className={cn(INK_CHIP, draft.decor.ink === k && INK_CHIP_CHECK)}
              style={{ background: INKS[k].value }}
              onClick={() => {
                play('click')
                updateDraft((d) => (d.decor.ink = k))
              }}
              aria-label={`${INKS[k].label} ink`}
              title={INKS[k].label}
            />
          ))}
        </div>

        <span className={SHELF_TITLE}>paper</span>
        <div className="flex items-center gap-2" role="radiogroup" aria-label="card paper">
          {(Object.keys(PAPERS) as PaperStyle[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={draft.decor.paper === p}
              className={cn(PAPER_SWATCH, draft.decor.paper === p && PAPER_SWATCH_ACTIVE)}
              style={PAPERS[p].style}
              onClick={() => {
                play('click')
                updateDraft((d) => (d.decor.paper = p))
              }}
              aria-label={`${PAPERS[p].label} paper`}
              title={PAPERS[p].label}
            />
          ))}
        </div>

        <p className="font-hand text-[0.85rem] leading-[1.45] text-ink-faint">
          drag things into place · scroll on a selected sticker to spin it · backspace removes it · they can
          hang off the edge, that's the charm
        </p>
      </div>
    </WobblyFrame>
  )
}
