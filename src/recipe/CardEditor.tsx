import { useLayoutEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useRecipes } from '../state/RecipesContext'
import type { BrewMethod, GrindSize, IngredientKind } from '../state/types'
import { uid, BREW_METHOD_LABELS } from '../state/types'
import { WobblyDivider } from '../components/handmade/WobblyDivider'
import { IngredientIcon, PARAM_CHIP } from './IndexCard'
import { ingredientName } from './ingredients'
import { formatTimeSec, parseTimeStr } from '../lib/format'
import { useSfx } from '../audio/useSfx'

const METHODS = Object.keys(BREW_METHOD_LABELS) as BrewMethod[]
const GRINDS: GrindSize[] = ['fine', 'medium-fine', 'medium', 'medium-coarse', 'coarse']
const KINDS: IngredientKind[] = ['coffee', 'water', 'milk', 'ice', 'other']

// dashed-underline fields + wobbly chips/buttons — the editable face of the card.
// Dashed underlines use the [border-bottom:…] arbitrary property so only the bottom
// edge draws (a plain border-dashed utility would dash all four sides).
const FOCUS_UNDERLINE = 'focus:outline-none focus:[border-bottom-color:var(--color-red)]'
const TITLE_INPUT = `min-w-0 flex-1 [border-bottom:2px_dashed_rgba(42,27,16,0.25)] bg-transparent px-0.5 pb-0.5 font-script text-[2rem] font-bold leading-[1.1] text-[color:var(--card-ink)] placeholder:font-normal placeholder:text-ink-faint ${FOCUS_UNDERLINE}`
const METHOD_SELECT =
  'mt-1.5 inline-block whitespace-nowrap rotate-[2.4deg] border-0 bg-transparent px-2.5 pt-1.25 pb-1 font-hand text-[0.92rem] uppercase tracking-[0.07em] text-[color:var(--card-ink)] opacity-[0.85] focus:outline-none'
const ING_AMOUNT = `w-14.5 [border-bottom:2px_dashed_rgba(42,27,16,0.25)] bg-transparent px-0.5 text-right font-script text-[1.36rem] text-[color:var(--card-ink)] ${FOCUS_UNDERLINE}`
const UNIT_BTN =
  'rounded-[10px_4px_12px_5px/5px_12px_4px_10px] border-[1.8px] border-solid border-[color:var(--card-ink)] px-1.75 py-px font-hand text-[0.85rem] text-[color:var(--card-ink)] opacity-80 hover:bg-[rgba(42,27,16,0.07)] hover:opacity-100'
const KIND_SELECT = `max-w-[110px] [border-bottom:2px_dashed_rgba(42,27,16,0.2)] bg-transparent font-script text-[1.15rem] text-[color:var(--card-ink)] ${FOCUS_UNDERLINE}`
const OTHER_LABEL = `w-25 [border-bottom:2px_dashed_rgba(42,27,16,0.25)] bg-transparent font-script text-[1.2rem] text-[color:var(--card-ink)] ${FOCUS_UNDERLINE}`
const TINY_BTN =
  'grid h-5.5 w-5.5 flex-none place-items-center rounded-[50%_40%_50%_45%] text-[0.8rem] leading-none text-ink-faint hover:bg-[rgba(224,52,30,0.1)] hover:text-red'
const ADD_CHIP =
  'rounded-[12px_5px_14px_6px/6px_14px_5px_12px] border-[1.8px] border-dashed border-ink-faint px-2.25 pt-0.5 pb-0.75 font-hand text-[0.82rem] text-ink-soft hover:border-red hover:text-red'
const PARAM_INPUT = `w-10 [border-bottom:1.8px_dashed_rgba(42,27,16,0.3)] bg-transparent text-center font-hand text-[0.92rem] text-[color:var(--card-ink)] ${FOCUS_UNDERLINE}`
const PARAM_SELECT =
  'border-0 bg-transparent font-hand text-[0.92rem] text-[color:var(--card-ink)] focus:outline-none'
const STEP_NUM =
  'mt-0.5 grid h-6.5 w-6.5 flex-none place-items-center rounded-[55%_45%_50%_50%/50%_55%_45%_50%] border-2 border-solid border-[color:var(--card-ink)] font-hand text-[0.92rem] text-[color:var(--card-ink)] [transform:rotate(-3deg)]'
const STEP_INPUT = `flex-1 resize-none overflow-hidden [border-bottom:2px_dashed_rgba(42,27,16,0.18)] bg-transparent px-0.5 pb-px font-script text-[1.36rem] leading-[1.32] text-[color:var(--card-ink)] ${FOCUS_UNDERLINE}`
const COL_LABEL = 'mb-1.5 font-display text-[0.72rem] uppercase tracking-[0.12em] opacity-[0.6]'
const ING_LIST = 'm-0 flex list-none flex-col gap-1 p-0'
const ING_ROW = 'flex items-center gap-1.75 font-script text-[1.36rem] leading-[1.5]'

/** The write-mode face of the card — handwriting you can type into. */
export function CardEditor() {
  const { draft, updateDraft } = useRecipes()
  const play = useSfx()
  const timeRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <div className="flex items-start gap-3.5 pr-16">
        <input
          className={TITLE_INPUT}
          value={draft.title}
          placeholder="name this brew…"
          maxLength={48}
          onChange={(e) => updateDraft((d) => (d.title = e.target.value))}
          aria-label="recipe title"
        />
        <select
          className={METHOD_SELECT}
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

      <div className="grid flex-1 grid-cols-[46%_1fr] items-start gap-x-[22px] gap-y-2">
        <div>
          <div className={COL_LABEL}>ingredients</div>
          <ul className={ING_LIST}>
            {draft.ingredients.map((ing) => (
              <li key={ing.id} className={ING_ROW}>
                <IngredientIcon kind={ing.kind} />
                <input
                  className={ING_AMOUNT}
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
                  className={UNIT_BTN}
                  onClick={() =>
                    updateDraft((d) => {
                      const target = d.ingredients.find((x) => x.id === ing.id)
                      if (target) target.unit = target.unit === 'g' ? 'ml' : 'g'
                    })
                  }
                  aria-label={`unit: ${ing.unit} — click to toggle`}
                >
                  {ing.unit}
                </button>
                {ing.kind === 'other' ? (
                  <input
                    className={OTHER_LABEL}
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
                    className={KIND_SELECT}
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
                  className={TINY_BTN}
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(['coffee', 'water', 'milk', 'other'] as IngredientKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                className={ADD_CHIP}
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

          <div className="mt-2.5 flex flex-wrap gap-1.75">
            <span className={PARAM_CHIP}>
              🌡
              <input
                className={PARAM_INPUT}
                type="number"
                min={0}
                max={100}
                value={draft.params.tempC ?? ''}
                placeholder="–"
                onChange={(e) =>
                  updateDraft(
                    (d) => (d.params.tempC = e.target.value === '' ? undefined : Number(e.target.value)),
                  )
                }
                aria-label="water temperature in celsius"
              />
              °C
            </span>
            <span className={PARAM_CHIP}>
              ⚙
              <select
                className={PARAM_SELECT}
                value={draft.params.grind ?? ''}
                onChange={(e) =>
                  updateDraft(
                    (d) => (d.params.grind = (e.target.value || undefined) as GrindSize | undefined),
                  )
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
            <span className={PARAM_CHIP}>
              ⏱
              <input
                ref={timeRef}
                className={PARAM_INPUT}
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
          <div className={COL_LABEL}>how it goes</div>
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
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {draft.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.25">
            <span className={STEP_NUM} style={{ rotate: `${((i * 47) % 9) - 4}deg` }}>
              {i + 1}
            </span>
            <StepTextarea
              value={step}
              index={i}
              onChange={(value) => updateDraft((d) => (d.steps[i] = value))}
            />
            <span className="-mt-0.5 flex flex-col gap-0">
              <button
                type="button"
                className={TINY_BTN}
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
                className={TINY_BTN}
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
                className={TINY_BTN}
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
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          className={ADD_CHIP}
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

/** One step's textarea — autosizes whenever its value changes hands (typing, reorder, delete). */
function StepTextarea({
  value,
  index,
  onChange,
}: {
  value: string
  index: number
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      className={STEP_INPUT}
      value={value}
      rows={1}
      placeholder="then…"
      onChange={(e) => onChange(e.target.value.replace(/\n/g, ' '))}
      aria-label={`step ${index + 1}`}
    />
  )
}
