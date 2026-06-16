import { PersonaPopup, PopupRow } from '../components/persona/PersonaPopup'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { WobblyButton } from '../components/handmade/WobblyButton'
import { WobblyFrame } from '../components/handmade/WobblyFrame'
import { ART } from '../art/registry'
import { useScene } from '../state/SceneContext'
import { BREW_METHOD_LABELS } from '../state/types'
import { HOUSE_RECIPES } from '../content/houseRecipes'
import { requestBoardFocus } from '../gallery/focusBus'
import type { Bean, BeanStatus } from './types'
import { BEAN_STATUS_LABELS } from './types'
import { RoastGauge } from './RoastGauge'

const NOTE_CHIP =
  'inline-flex items-center rounded-[14px_6px_16px_7px/7px_16px_6px_14px] bg-[rgba(42,27,16,0.07)] px-2.5 py-0.75 font-hand text-[0.92rem] text-ink-soft'
const METHOD_BADGE =
  'inline-block whitespace-nowrap rotate-[2deg] rounded-[6px_14px_8px_12px/12px_8px_14px_6px] border-[2.2px] border-solid border-ink px-2.5 pt-1.25 pb-1 font-display text-[0.76rem] uppercase tracking-[0.07em] text-ink opacity-85'
const LABEL = 'mb-1 font-display text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint'

const STATUS_STYLE: Record<BeanStatus, string> = {
  'in-the-cupboard': 'border-ink-forest text-ink-forest',
  finished: 'border-ink-faint text-ink-faint',
  'want-again': 'border-red text-red',
}

/** A small mug glyph; filled cups count out the rating. */
function CupGlyph({ filled }: { filled: boolean }) {
  const stroke = filled ? 'var(--ink)' : 'var(--ink-faint)'
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 8 h11 v5 a5 5 0 0 1 -5 5 h-1 a5 5 0 0 1 -5 -5 z"
        fill={filled ? 'var(--caramel)' : 'transparent'}
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M16 9 h2 a2.4 2.4 0 0 1 0 4.8 h-2" fill="none" stroke={stroke} strokeWidth="1.7" />
    </svg>
  )
}

function Rating({ value }: { value: number }) {
  const full = Math.round(value)
  return (
    <div>
      <div className={LABEL}>rating</div>
      <div className="flex items-center gap-2" role="img" aria-label={`rated ${value} out of 5`}>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <CupGlyph key={i} filled={i < full} />
          ))}
        </div>
        <span className="font-hand text-[0.95rem] text-ink-soft">{value}/5</span>
      </div>
    </div>
  )
}

interface CuppingCardProps {
  bean: Bean
  onClose: () => void
}

/** The full look at one bean — the cupboard's answer to the recipe focus card. */
export function CuppingCard({ bean, onClose }: CuppingCardProps) {
  const { goTo } = useScene()
  const BeanBagArt = ART['bean-bag']
  const linked = bean.recipeId ? HOUSE_RECIPES.find((r) => r.id === bean.recipeId) : undefined
  const subtitle = [bean.roaster, bean.origin].filter(Boolean).join(' · ')

  const onOpenRecipe = () => {
    if (!linked) return
    onClose()
    goTo('gallery')
    requestBoardFocus(linked.id)
  }

  return (
    <PersonaPopup
      popupKey={`bean-${bean.id}`}
      onClose={onClose}
      labelledBy={`bean-title-${bean.id}`}
      width={640}
    >
      <PopupRow>
        <div id={`bean-title-${bean.id}`} className="pr-10">
          <PersonaTitle text={bean.name} size="md" seed={bean.id} />
          {subtitle && (
            <p className="mt-1.5 rotate-[-0.6deg] font-script text-[1.3rem] text-ink-soft">{subtitle}</p>
          )}
        </div>
      </PopupRow>

      <PopupRow>
        <div className="flex items-start gap-5 max-[760px]:flex-col max-[760px]:items-center">
          <div
            className="-mt-1 h-40 w-36 flex-none *:h-full *:w-full *:object-contain"
            aria-hidden="true"
          >
            <BeanBagArt />
          </div>
          <div className="flex flex-1 flex-col gap-3.5">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <RoastGauge level={bean.roastLevel} />
              <Rating value={bean.rating} />
            </div>

            {bean.process && (
              <div>
                <span className={LABEL}>process</span>
                <span className="font-script text-[1.25rem] text-ink">{bean.process}</span>
              </div>
            )}

            {bean.tastingNotes.length > 0 && (
              <div>
                <div className={LABEL}>tasting notes</div>
                <div className="flex flex-wrap gap-1.75">
                  {bean.tastingNotes.map((note) => (
                    <span key={note} className={NOTE_CHIP}>
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-block rounded-[7px_12px_8px_11px/11px_8px_12px_7px] border-2 border-solid px-2.5 pt-1 pb-0.75 font-display text-[0.72rem] uppercase tracking-[0.09em] ${STATUS_STYLE[bean.status]}`}
              >
                {BEAN_STATUS_LABELS[bean.status]}
              </span>
              {bean.brewMethods.map((m) => (
                <span key={m} className={METHOD_BADGE}>
                  {BREW_METHOD_LABELS[m]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </PopupRow>

      {bean.blurb && (
        <PopupRow>
          <WobblyFrame seed={`bean-blurb-${bean.id}`} fill="var(--foam)" padding="11px 15px">
            <p className="rotate-[-0.5deg] font-script text-[1.35rem] leading-[1.25] text-ink">
              {bean.blurb}
            </p>
          </WobblyFrame>
        </PopupRow>
      )}

      {(bean.boughtAt || bean.price) && (
        <PopupRow>
          <p className="font-hand text-[0.92rem] text-ink-faint">
            {[bean.boughtAt && `picked up ${bean.boughtAt}`, bean.price].filter(Boolean).join(' · ')}
          </p>
        </PopupRow>
      )}

      <PopupRow>
        <div className="flex flex-wrap items-center gap-3.5 pt-1">
          {linked && (
            <WobblyButton variant="red" seed={`bean-recipe-${bean.id}`} onClick={onOpenRecipe}>
              made lucas&rsquo; “{linked.title}” with this →
            </WobblyButton>
          )}
          <WobblyButton variant="ghost" seed={`bean-close-${bean.id}`} onClick={onClose}>
            neat.
          </WobblyButton>
        </div>
      </PopupRow>
    </PersonaPopup>
  )
}
