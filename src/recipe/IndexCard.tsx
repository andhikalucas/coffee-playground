import { useMemo } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import type { Recipe, IngredientKind } from '../state/types'
import { ingredientName } from './ingredients'
import { BREW_METHOD_LABELS } from '../state/types'
import { PAPERS, INKS } from './papers'
import { wobblyRectPath } from '../lib/wobble'
import { formatTimeSec } from '../lib/format'
import { useElementSize } from '../hooks/useElementSize'
import { PaperGrain } from '../components/handmade/PaperGrain'
import { WobblyDivider } from '../components/handmade/WobblyDivider'
import { RatioBadge } from './RatioBadge'
import { DecorateLayer } from './DecorateLayer'
import type { DecorateProps } from './DecorateLayer'
import { cn } from '../lib/cn'

export type CardMode = 'edit' | 'decorate' | 'static'

// shared chip/icon classes reused by the editor face too
export const PARAM_CHIP =
  'inline-flex items-center gap-1 rounded-[14px_6px_16px_7px/7px_16px_6px_14px] bg-[rgba(42,27,16,0.06)] px-2.5 py-0.75 font-hand text-[0.92rem] text-[color:var(--card-ink)]'
export const ING_ICON = 'h-5 w-5 flex-none'

interface IndexCardProps {
  recipe: Recipe
  mode: CardMode
  /** the editor form, injected by the maker in edit mode */
  editor?: ReactNode
  decorate?: DecorateProps
  cardRef?: RefObject<HTMLDivElement | null>
  className?: string
  style?: CSSProperties
}

/**
 * THE card. Maker, gallery thumbnails, focus popups and PNG export all render
 * this same component, so what you decorate is exactly what you get.
 */
export function IndexCard({ recipe, mode, editor, decorate, cardRef, className, style }: IndexCardProps) {
  const [borderRef, { width, height }] = useElementSize()
  const border = useMemo(
    () =>
      width > 4 && height > 4
        ? wobblyRectPath(width, height, { seed: 'card-' + recipe.id, amplitude: 2.6, segment: 18 })
        : null,
    [width, height, recipe.id],
  )

  return (
    <div
      ref={(el) => {
        borderRef.current = el
        if (cardRef) cardRef.current = el
      }}
      className={cn(
        'relative w-[640px] min-h-[426px] text-[color:var(--card-ink,var(--ink))] shadow-[5px_6px_0_rgba(42,27,16,0.22)]',
        className,
      )}
      style={
        {
          ...PAPERS[recipe.decor.paper].style,
          '--card-ink': INKS[recipe.decor.ink].value,
          ...style,
        } as CSSProperties
      }
    >
      <PaperGrain scoped />
      {border && (
        <svg
          className="pointer-events-none absolute -inset-2 z-3 h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-visible"
          viewBox={`-8 -8 ${width + 16} ${height + 16}`}
          aria-hidden="true"
        >
          <path d={border} fill="none" stroke="var(--ink)" strokeWidth={2.6} strokeLinecap="round" />
        </svg>
      )}
      
      <RatioBadge ingredients={recipe.ingredients} />

      <div className="relative z-1 flex min-h-[426px] flex-col gap-2.5 px-7 pt-5.5 pb-6">
        {mode === 'edit' && editor ? editor : <StaticCardContent recipe={recipe} />}
      </div>

      <DecorateLayer recipe={recipe} interactive={mode === 'decorate'} decorate={decorate} />
    </div>
  )
}

/* ————— static rendering (gallery, focus, export) ————— */

function StaticCardContent({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <div className="flex items-start gap-3.5 pr-16">
        <h3 className="min-w-0 flex-1 [border-bottom:2px_dashed_transparent] bg-transparent px-0.5 pb-0.5 font-script text-[2rem] font-bold leading-[1.1] text-[color:var(--card-ink)]">
          {recipe.title || 'untitled brew'}
        </h3>
        <span className="mt-1.5 inline-block whitespace-nowrap rotate-[2.4deg] rounded-[6px_14px_8px_12px/12px_8px_14px_6px] border-[2.2px] border-solid border-[color:var(--card-ink)] px-2.5 pt-1.25 pb-1 font-display text-[0.82rem] uppercase tracking-[0.07em] text-[color:var(--card-ink)] opacity-[0.85]">
          {BREW_METHOD_LABELS[recipe.method]}
        </span>
      </div>
      <WobblyDivider seed={'div-' + recipe.id} stroke="var(--red)" />
      <div className="grid flex-1 grid-cols-[46%_1fr] items-start gap-x-[22px] gap-y-2">
        <div>
          <div className="mb-1.5 font-display text-[0.72rem] uppercase tracking-[0.12em] opacity-[0.6]">
            ingredients
          </div>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-1.75 font-script text-[1.36rem] leading-[1.5]">
                <IngredientIcon kind={ing.kind} />
                <span>
                  {Number.isFinite(ing.amount) ? ing.amount : '–'} {ing.unit} {ingredientName(ing)}
                </span>
              </li>
            ))}
          </ul>
          <ParamChips recipe={recipe} />
        </div>
        <div>
          <div className="mb-1.5 font-display text-[0.72rem] uppercase tracking-[0.12em] opacity-[0.6]">
            how it goes
          </div>
          <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.25">
                <span
                  className="mt-0.5 grid h-6.5 w-6.5 flex-none place-items-center rounded-[55%_45%_50%_50%/50%_55%_45%_50%] border-2 border-solid border-[color:var(--card-ink)] font-hand text-[0.92rem] text-[color:var(--card-ink)] [transform:rotate(-3deg)]"
                  style={{ rotate: `${((i * 47) % 9) - 4}deg` }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 resize-none overflow-hidden bg-transparent px-0.5 pb-px font-script text-[1.36rem] leading-[1.32] text-[color:var(--card-ink)]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}

export function ParamChips({ recipe }: { recipe: Recipe }) {
  const { tempC, grind, timeSec } = recipe.params
  if (tempC === undefined && !grind && timeSec === undefined) return null
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.75">
      {tempC !== undefined && <span className={PARAM_CHIP}>🌡 {tempC}°C</span>}
      {grind && <span className={PARAM_CHIP}>⚙ {grind} grind</span>}
      {timeSec !== undefined && timeSec > 0 && <span className={PARAM_CHIP}>⏱ {formatTimeSec(timeSec)}</span>}
    </div>
  )
}

/** Tiny hand-drawn glyphs for ingredient kinds. */
export function IngredientIcon({ kind }: { kind: IngredientKind }) {
  switch (kind) {
    case 'coffee':
      return (
        <svg viewBox="0 0 24 24" className={ING_ICON} aria-hidden="true">
          <ellipse
            cx="12"
            cy="12"
            rx="6.4"
            ry="8.4"
            transform="rotate(-16 12 12)"
            fill="var(--roast)"
            stroke="var(--ink)"
            strokeWidth="1.8"
          />
          <path
            d="M 10.4 5.4 Q 14.4 11 10.8 17.6"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'water':
      return (
        <svg viewBox="0 0 24 24" className={ING_ICON} aria-hidden="true">
          <path
            d="M 12 3.6 Q 18.6 12 17.4 16.6 Q 16.4 20.6 12 20.6 Q 7.6 20.6 6.6 16.6 Q 5.6 12 12 3.6 Z"
            fill="rgba(43, 58, 85, 0.25)"
            stroke="var(--ink-navy)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'milk':
      return (
        <svg viewBox="0 0 24 24" className={ING_ICON} aria-hidden="true">
          <path
            d="M 8 4 L 16 3.8 L 16.4 7 L 18 10 L 17.6 20 L 6.8 20.4 L 6.4 10 L 8.2 6.8 Z"
            fill="var(--foam)"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M 7 13 Q 12 11.6 17.4 13.2" fill="none" stroke="var(--ink)" strokeWidth="1.4" />
        </svg>
      )
    case 'ice':
      return (
        <svg viewBox="0 0 24 24" className={ING_ICON} aria-hidden="true">
          <path
            d="M 6.6 8.4 L 14 5 L 19 9.6 L 17.6 17 L 9.6 19.4 L 5 14.4 Z"
            fill="rgba(255, 249, 239, 0.8)"
            stroke="var(--ink-navy)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M 9 10.4 L 14.6 14.4" stroke="var(--ink-navy)" strokeWidth="1.3" opacity="0.6" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={ING_ICON} aria-hidden="true">
          <path
            d="M 12 4 L 13.8 9.6 L 19.6 9.8 L 15 13.4 L 16.6 19 L 12 15.6 L 7.4 19.2 L 9 13.4 L 4.4 9.9 L 10.2 9.6 Z"
            fill="var(--caramel-soft)"
            stroke="var(--ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
