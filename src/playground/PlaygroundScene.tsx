import { useState } from 'react'
import { AnimatePresence, LayoutGroup } from 'motion/react'
import { ITEMS } from './items'
import { useFloatField } from './useFloatField'
import { FloatingItem } from './FloatingItem'
import { ShelfMenu } from './ShelfMenu'
import { ItemPopup } from './ItemPopup'
import { useElementSize } from '../hooks/useElementSize'
import { useSettings } from '../state/SettingsContext'
import { useSfx } from '../audio/useSfx'
import { cn } from '../lib/cn'

type Mode = 'float' | 'menu'

// the two segmented-toggle buttons share a thinner inner seam, so border widths are
// declared per-side (avoids the border shorthand/longhand override ambiguity)
const MODE_BASE = 'relative border-solid border-ink px-4.5 pt-2 pb-2.25 font-hand text-[0.98rem]'
const MODE_FIRST = 'border-y-[2.5px] border-l-[2.5px] border-r-[1.5px] rounded-[14px_4px_4px_18px/18px_4px_4px_14px]'
const MODE_LAST = 'border-y-[2.5px] border-r-[2.5px] border-l-[1.5px] rounded-[4px_16px_14px_4px/4px_14px_18px_4px]'
const modeColors = (active: boolean) => (active ? 'bg-ink text-foam' : 'bg-foam text-ink')

/**
 * The toy box. Everything drifts (or sits on the shelf), everything is
 * draggable, and everything has a story behind a Persona slam.
 */
export function PlaygroundScene() {
  const [mode, setMode] = useState<Mode>('float')
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [hostRef, bounds] = useElementSize()
  const { reducedMotion } = useSettings()
  const play = useSfx()

  const field = useFloatField(ITEMS, {
    active: mode === 'float',
    reducedMotion,
    width: bounds.width,
    height: bounds.height,
  })

  const focused = ITEMS.find((i) => i.id === focusedId) ?? null

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    play('swish')
  }

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden">
      <LayoutGroup>
        {mode === 'float' ? (
          <div className="absolute inset-0">
            {ITEMS.map((item) => (
              <FloatingItem key={item.id} item={item} field={field} onOpen={setFocusedId} />
            ))}
          </div>
        ) : (
          <ShelfMenu onOpen={setFocusedId} />
        )}
      </LayoutGroup>

      <div
        className="absolute left-1/2 top-5.5 z-10 flex -translate-x-1/2 gap-0"
        role="group"
        aria-label="arrange the playground"
      >
        <button
          type="button"
          className={cn(MODE_BASE, MODE_FIRST, modeColors(mode === 'float'))}
          aria-pressed={mode === 'float'}
          onClick={() => switchMode('float')}
        >
          ✧ drift
        </button>
        <button
          type="button"
          className={cn(MODE_BASE, MODE_LAST, modeColors(mode === 'menu'))}
          aria-pressed={mode === 'menu'}
          onClick={() => switchMode('menu')}
        >
          ☰ shelf
        </button>
      </div>

      {mode === 'float' && (
        <p className="pointer-events-none absolute bottom-6.5 left-1/2 -translate-x-1/2 rotate-[-1.4deg] text-center font-script text-[1.25rem] text-ink-faint">
          drag things around · click anything for its story
        </p>
      )}

      <AnimatePresence>
        {focused && <ItemPopup item={focused} onClose={() => setFocusedId(null)} />}
      </AnimatePresence>
    </div>
  )
}
