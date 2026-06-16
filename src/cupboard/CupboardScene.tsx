import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ART } from '../art/registry'
import { rngFrom } from '../lib/rng'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSfx } from '../audio/useSfx'
import { BEANS } from './beans'
import { CuppingCard } from './CuppingCard'

const BeanBagArt = ART['bean-bag']
const FOAM_SHADOW = '[text-shadow:1px_1.5px_0_rgba(42,27,16,0.45)]'

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

/** Lucas' bean archive — kraft bags lined up on wooden shelves. */
export function CupboardScene() {
  const play = useSfx()
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const bagRefs = useRef<Array<HTMLButtonElement | null>>([])

  const isPhone = useMediaQuery('(max-width: 640px)')
  const perShelf = isPhone ? 2 : 3

  const focused = BEANS.find((b) => b.id === focusedId) ?? null

  // stable per-bag personality so the shelf reads hand-set, not ruler-straight
  const variances = useMemo(
    () =>
      BEANS.map((b) => {
        const rand = rngFrom(b.id + ':cupboard')
        return { rot: (rand() * 2 - 1) * 4, sizeMul: 0.92 + rand() * 0.16 }
      }),
    [],
  )

  const shelves = useMemo(() => chunk(BEANS, perShelf), [perShelf])

  const move = (next: number) => {
    const clamped = Math.max(0, Math.min(BEANS.length - 1, next))
    setActiveIdx(clamped)
    bagRefs.current[clamped]?.focus()
    play('click')
  }

  return (
    <>
      <div className="absolute inset-[70px_26px_26px] overflow-x-hidden overflow-y-auto cupboard-wood scrollable max-[1024px]:inset-[58px_12px_84px]">
        <div className="px-9 pt-7 pb-2 max-[768px]:px-3">
          <h2 className={`rotate-[-1deg] font-script text-[1.85rem] font-bold text-foam ${FOAM_SHADOW}`}>
            the cupboard
          </h2>
          <p className={`font-hand text-[0.98rem] text-foam/85 ${FOAM_SHADOW}`}>
            beans lucas has been drinking lately
          </p>
        </div>

        {BEANS.length === 0 ? (
          <p className={`px-9 py-10 font-script text-[1.4rem] text-foam ${FOAM_SHADOW} max-[768px]:px-3`}>
            the cupboard&rsquo;s bare right now — check back soon.
          </p>
        ) : (
          <div
            className="flex flex-col gap-12 px-8 pt-5 pb-12 max-[768px]:gap-8 max-[768px]:px-3"
            aria-label="beans in the cupboard"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                move(activeIdx + 1)
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                move(activeIdx - 1)
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                move(activeIdx + perShelf)
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                move(activeIdx - perShelf)
              } else if (e.key === 'Home') {
                e.preventDefault()
                move(0)
              } else if (e.key === 'End') {
                e.preventDefault()
                move(BEANS.length - 1)
              }
            }}
          >
            {shelves.map((row, si) => (
              <div key={si} className="flex flex-col">
                <div className="flex items-end justify-center gap-12 px-2 max-[768px]:gap-5">
                  {row.map((bean, j) => {
                    const gi = si * perShelf + j
                    const v = variances[gi]
                    return (
                      <motion.button
                        key={bean.id}
                        ref={(el) => {
                          bagRefs.current[gi] = el
                        }}
                        type="button"
                        tabIndex={gi === activeIdx ? 0 : -1}
                        className="flex w-[9.5rem] flex-col items-center gap-1.5 max-[768px]:w-[7rem]"
                        animate={{ scale: v.sizeMul, rotate: v.rot }}
                        whileHover={{ scale: v.sizeMul * 1.07, rotate: 0, y: -5 }}
                        whileTap={{ scale: v.sizeMul * 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        aria-label={`${bean.name}${bean.roaster ? ` by ${bean.roaster}` : ''} — open its cupping card`}
                        onFocus={() => setActiveIdx(gi)}
                        onClick={() => setFocusedId(bean.id)}
                      >
                        <div
                          className="h-36 w-32 drop-shadow-[2px_5px_4px_rgba(42,27,16,0.38)] *:h-full *:w-full *:object-contain max-[768px]:h-28 max-[768px]:w-24"
                          aria-hidden="true"
                        >
                          <BeanBagArt />
                        </div>
                        <div className="text-center leading-tight">
                          <div className={`font-script text-[1.24rem] font-bold text-foam ${FOAM_SHADOW}`}>
                            {bean.name}
                          </div>
                          {bean.roaster && (
                            <div className="font-hand text-[0.78rem] text-foam/75">{bean.roaster}</div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                <div className="cupboard-plank mx-1 mt-1.5" aria-hidden="true" />
              </div>
            ))}

            <p className={`px-1 pt-1 font-hand text-[0.9rem] text-foam/70 ${FOAM_SHADOW}`}>
              click a bag for its cupping card · ←↑↓→ to browse
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {focused && <CuppingCard bean={focused} onClose={() => setFocusedId(null)} />}
      </AnimatePresence>
    </>
  )
}
