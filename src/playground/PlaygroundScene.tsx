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
import styles from './playground.module.css'

type Mode = 'float' | 'menu'

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
    <div ref={hostRef} className={styles.host}>
      <LayoutGroup>
        {mode === 'float' ? (
          <div className={styles.floatLayer}>
            {ITEMS.map((item) => (
              <FloatingItem key={item.id} item={item} field={field} onOpen={setFocusedId} />
            ))}
          </div>
        ) : (
          <ShelfMenu onOpen={setFocusedId} />
        )}
      </LayoutGroup>

      <div className={styles.modeToggle} role="group" aria-label="arrange the playground">
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'float' ? styles.modeBtnActive : ''}`}
          aria-pressed={mode === 'float'}
          onClick={() => switchMode('float')}
        >
          ✧ drift
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'menu' ? styles.modeBtnActive : ''}`}
          aria-pressed={mode === 'menu'}
          onClick={() => switchMode('menu')}
        >
          ☰ shelf
        </button>
      </div>

      {mode === 'float' && (
        <p className={styles.hint}>drag things around · click anything for its story</p>
      )}

      <AnimatePresence>
        {focused && <ItemPopup item={focused} onClose={() => setFocusedId(null)} />}
      </AnimatePresence>
    </div>
  )
}
