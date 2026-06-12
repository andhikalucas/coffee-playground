import { useRecipes } from '../state/RecipesContext'
import type { InkColor, PaperStyle, StickerId } from '../state/types'
import { uid } from '../state/types'
import { STICKERS, STICKER_IDS } from '../art/stickers/registry'
import { PAPERS, INKS } from './papers'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { useSfx } from '../audio/useSfx'
import styles from './recipe.module.css'

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
      <div className={styles.shelfPanel}>
        <span className={styles.shelfTitle}>sticker drawer</span>
        <div className={styles.stickerGrid}>
          {STICKER_IDS.map((sid) => {
            const def = STICKERS[sid]
            const Doodle = def.Component
            return (
              <button
                key={sid}
                type="button"
                className={styles.stickerBtn}
                onClick={() => addSticker(sid)}
                aria-label={`add ${def.label} sticker`}
                title={def.label}
              >
                <Doodle />
              </button>
            )
          })}
        </div>

        <span className={styles.shelfTitle}>washi tape</span>
        <div className={styles.tapeRow}>
          {([0, 1, 2] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              className={styles.tapeBtn}
              onClick={() => addTape(variant)}
              aria-label={`add tape strip ${variant + 1}`}
            >
              <span
                className={styles.tapeSwatch}
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

        <span className={styles.shelfTitle}>ink</span>
        <div className={styles.pickRow} role="radiogroup" aria-label="handwriting ink">
          {(Object.keys(INKS) as InkColor[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={draft.decor.ink === k}
              className={`${styles.inkChip} ${draft.decor.ink === k ? styles.inkChipActive : ''}`}
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

        <span className={styles.shelfTitle}>paper</span>
        <div className={styles.pickRow} role="radiogroup" aria-label="card paper">
          {(Object.keys(PAPERS) as PaperStyle[]).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={draft.decor.paper === p}
              className={`${styles.paperSwatch} ${draft.decor.paper === p ? styles.paperSwatchActive : ''}`}
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

        <p className={styles.shelfHint}>
          drag things into place · scroll on a selected sticker to spin it · backspace removes it · they can
          hang off the edge, that's the charm
        </p>
      </div>
    </WobblyFrame>
  )
}
