import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useRecipes } from '../state/RecipesContext'
import type { BrewMethod, GrindSize, IngredientKind } from '../state/types'
import { uid, BREW_METHOD_LABELS } from '../state/types'
import { WobblyDivider } from '../components/handmade/WobblyDivider'
import { IngredientIcon, ingredientName } from './IndexCard'
import { formatTimeSec, parseTimeStr } from '../lib/format'
import { useSfx } from '../audio/useSfx'
import styles from './recipe.module.css'

const METHODS = Object.keys(BREW_METHOD_LABELS) as BrewMethod[]
const GRINDS: GrindSize[] = ['fine', 'medium-fine', 'medium', 'medium-coarse', 'coarse']
const KINDS: IngredientKind[] = ['coffee', 'water', 'milk', 'ice', 'other']

/** The write-mode face of the card — handwriting you can type into. */
export function CardEditor() {
  const { draft, updateDraft } = useRecipes()
  const play = useSfx()
  const timeRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div className={styles.headerRow}>
        <input
          className={styles.titleInput}
          value={draft.title}
          placeholder="name this brew…"
          maxLength={48}
          onChange={(e) => updateDraft((d) => (d.title = e.target.value))}
          aria-label="recipe title"
        />
        <select
          className={`${styles.methodStamp} ${styles.paramSelect}`}
          value={draft.method}
          onChange={(e) => {
            play('click')
            updateDraft((d) => (d.method = e.target.value as BrewMethod))
          }}
          aria-label="brew method"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {BREW_METHOD_LABELS[m]}
            </option>
          ))}
        </select>
      </div>
      <WobblyDivider seed={'div-' + draft.id} stroke="var(--red)" />

      <div className={styles.bodyCols}>
        <div>
          <div className={styles.colLabel}>ingredients</div>
          <ul className={styles.ingList}>
            {draft.ingredients.map((ing) => (
              <li key={ing.id} className={styles.ingRow}>
                <IngredientIcon kind={ing.kind} />
                <input
                  className={styles.ingAmount}
                  type="number"
                  min={0}
                  step="any"
                  value={Number.isFinite(ing.amount) ? ing.amount : ''}
                  onChange={(e) =>
                    updateDraft((d) => {
                      const target = d.ingredients.find((x) => x.id === ing.id)
                      if (target) target.amount = e.target.value === '' ? NaN : Number(e.target.value)
                    })
                  }
                  aria-label={`${ingredientName(ing)} amount`}
                />
                <button
                  type="button"
                  className={styles.unitBtn}
                  onClick={() =>
                    updateDraft((d) => {
                      const target = d.ingredients.find((x) => x.id === ing.id)
                      if (target) target.unit = target.unit === 'g' ? 'ml' : 'g'
                    })
                  }
                  aria-label="toggle unit"
                >
                  {ing.unit}
                </button>
                {ing.kind === 'other' ? (
                  <input
                    className={styles.otherLabelInput}
                    value={ing.label ?? ''}
                    placeholder="of what?"
                    onChange={(e) =>
                      updateDraft((d) => {
                        const target = d.ingredients.find((x) => x.id === ing.id)
                        if (target) target.label = e.target.value
                      })
                    }
                    aria-label="ingredient name"
                  />
                ) : (
                  <select
                    className={styles.kindSelect}
                    value={ing.kind}
                    onChange={(e) =>
                      updateDraft((d) => {
                        const target = d.ingredients.find((x) => x.id === ing.id)
                        if (target) target.kind = e.target.value as IngredientKind
                      })
                    }
                    aria-label="ingredient kind"
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  className={styles.tinyBtn}
                  onClick={() => {
                    play('swish')
                    updateDraft((d) => (d.ingredients = d.ingredients.filter((x) => x.id !== ing.id)))
                  }}
                  aria-label={`remove ${ingredientName(ing)}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.addChips}>
            {(['coffee', 'water', 'milk', 'other'] as IngredientKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                className={styles.addChip}
                onClick={() => {
                  play('pop')
                  updateDraft((d) =>
                    d.ingredients.push({
                      id: uid(),
                      kind,
                      amount: kind === 'coffee' ? 15 : kind === 'milk' ? 100 : kind === 'water' ? 200 : 1,
                      unit: kind === 'coffee' ? 'g' : 'ml',
                      ...(kind === 'other' ? { label: '' } : {}),
                    }),
                  )
                }}
              >
                + {kind === 'other' ? 'something else' : kind}
              </button>
            ))}
          </div>

          <div className={styles.paramsRow}>
            <span className={styles.paramChip}>
              🌡
              <input
                className={styles.paramInput}
                type="number"
                min={0}
                max={100}
                value={draft.params.tempC ?? ''}
                placeholder="–"
                onChange={(e) =>
                  updateDraft((d) => (d.params.tempC = e.target.value === '' ? undefined : Number(e.target.value)))
                }
                aria-label="water temperature in celsius"
              />
              °C
            </span>
            <span className={styles.paramChip}>
              ⚙
              <select
                className={styles.paramSelect}
                value={draft.params.grind ?? ''}
                onChange={(e) =>
                  updateDraft((d) => (d.params.grind = (e.target.value || undefined) as GrindSize | undefined))
                }
                aria-label="grind size"
              >
                <option value="">grind?</option>
                {GRINDS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </span>
            <span className={styles.paramChip}>
              ⏱
              <input
                ref={timeRef}
                className={styles.paramInput}
                style={{ width: 48 }}
                defaultValue={formatTimeSec(draft.params.timeSec)}
                placeholder="m:ss"
                onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                  const parsed = parseTimeStr(e.target.value)
                  updateDraft((d) => (d.params.timeSec = parsed))
                  if (timeRef.current) timeRef.current.value = formatTimeSec(parsed)
                }}
                aria-label="brew time (minutes:seconds)"
              />
            </span>
          </div>
        </div>

        <div>
          <div className={styles.colLabel}>how it goes</div>
          <StepsEditor />
        </div>
      </div>
    </>
  )
}

function StepsEditor() {
  const { draft, updateDraft } = useRecipes()
  const play = useSfx()

  return (
    <>
      <ol className={styles.stepsList}>
        {draft.steps.map((step, i) => (
          <li key={i} className={styles.stepRow}>
            <span className={styles.stepNum} style={{ rotate: `${((i * 47) % 9) - 4}deg` }}>
              {i + 1}
            </span>
            <textarea
              className={styles.stepInput}
              value={step}
              rows={1}
              placeholder="then…"
              onChange={(e) => {
                const value = e.target.value.replace(/\n/g, ' ')
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
                updateDraft((d) => (d.steps[i] = value))
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto'
                  el.style.height = `${el.scrollHeight}px`
                }
              }}
              aria-label={`step ${i + 1}`}
            />
            <span className={styles.stepControls}>
              <button
                type="button"
                className={styles.tinyBtn}
                disabled={i === 0}
                onClick={() =>
                  updateDraft((d) => {
                    ;[d.steps[i - 1], d.steps[i]] = [d.steps[i], d.steps[i - 1]]
                  })
                }
                aria-label={`move step ${i + 1} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.tinyBtn}
                disabled={i === draft.steps.length - 1}
                onClick={() =>
                  updateDraft((d) => {
                    ;[d.steps[i + 1], d.steps[i]] = [d.steps[i], d.steps[i + 1]]
                  })
                }
                aria-label={`move step ${i + 1} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.tinyBtn}
                onClick={() => {
                  play('swish')
                  updateDraft((d) => (d.steps = d.steps.filter((_, idx) => idx !== i)))
                }}
                aria-label={`remove step ${i + 1}`}
              >
                ✕
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className={styles.addChips}>
        <button
          type="button"
          className={styles.addChip}
          onClick={() => {
            play('pop')
            updateDraft((d) => d.steps.push(''))
          }}
        >
          + another step
        </button>
      </div>
    </>
  )
}
