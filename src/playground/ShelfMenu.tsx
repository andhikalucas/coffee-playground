import { useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ART } from '../art/registry'
import { ITEMS } from './items'
import { PersonaTitle } from '../components/persona/PersonaTitle'
import { rngFrom } from '../lib/rng'
import { useSfx } from '../audio/useSfx'
import styles from './playground.module.css'

interface ShelfMenuProps {
  onOpen: (id: string) => void
}

/** Persona-style diagonal menu: a red jag chip slides between rows. */
export function ShelfMenu({ onOpen }: ShelfMenuProps) {
  const play = useSfx()
  const [activeIdx, setActiveIdx] = useState(0)
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([])
  const active = ITEMS[activeIdx]
  const Art = ART[active.art]

  // each row gets a stable, seeded personality: a slight tilt, a touch of size
  // variation, and an asymmetric horizontal nudge — so the column reads hand-set
  // rather than a ruler-straight diagonal.
  const variances = useMemo(
    () =>
      ITEMS.map((item) => {
        const rand = rngFrom(item.id + ':shelf')
        return {
          rot: (rand() * 2 - 1) * 3.4, // ±3.4° tilt
          sizeMul: 0.93 + rand() * 0.14, // 0.93–1.07, kept subtle so titles stay legible
          dx: (rand() * 2 - 1) * 44, // ±44px asymmetric offset
        }
      }),
    [],
  )

  const moveTo = (idx: number) => {
    const next = (idx + ITEMS.length) % ITEMS.length
    setActiveIdx(next)
    rowRefs.current[next]?.focus()
    play('click')
  }

  return (
    <div className={styles.shelfWrap}>
      <ul
        className={styles.shelfList}
        aria-label="everything on the shelf"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            moveTo(activeIdx + 1)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            moveTo(activeIdx - 1)
          } else if (e.key === 'Home') {
            e.preventDefault()
            moveTo(0)
          } else if (e.key === 'End') {
            e.preventDefault()
            moveTo(ITEMS.length - 1)
          }
        }}
      >
        {ITEMS.map((item, i) => {
          const isActive = i === activeIdx
          const v = variances[i]
          return (
            <li
              key={item.id}
              className={styles.shelfItem}
              style={{ transform: `translateX(${v.dx}px) rotate(${v.rot}deg) skewX(-8deg)` }}
            >
              <motion.button
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-pressed={isActive}
                className={`${styles.shelfRow} ${isActive ? styles.shelfRowActive : ''}`}
                style={{ '--row-mul': v.sizeMul } as CSSProperties}
                animate={{ scale: isActive ? 1.14 : 1, x: isActive ? 18 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                onPointerEnter={() => {
                  if (i !== activeIdx) {
                    setActiveIdx(i)
                    play('click')
                  }
                }}
                onFocus={() => setActiveIdx(i)}
                onClick={() => onOpen(item.id)}
              >
                {isActive && (
                  <motion.span
                    className={styles.chip}
                    layoutId="shelf-chip"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={styles.shelfLabel}>{item.name}</span>
              </motion.button>
            </li>
          )
        })}
      </ul>

      <div className={styles.shelfPreview} aria-hidden="true">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active.id}
            className={styles.previewArt}
            layoutId={`art-${active.id}`}
            initial={{ scale: 0.7, opacity: 0, rotate: 6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.72, opacity: 0, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <Art />
          </motion.div>
        </AnimatePresence>
        <PersonaTitle key={`t-${active.id}`} text={active.name} size="md" seed={active.id} />
        <p className={styles.previewBlurb}>{active.blurb}</p>
        <span className={styles.previewHint}>↑↓ to browse · enter to open</span>
      </div>
    </div>
  )
}
