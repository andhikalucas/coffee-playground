import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { useScene } from '../../state/SceneContext'
import type { SceneId } from '../../state/types'
import { tornEdgePolygon } from '../../lib/wobble'
import { tilt } from '../../styles/tokens'
import { useSfx } from '../../audio/useSfx'
import styles from './hud.module.css'

const TABS: Array<{ id: SceneId; label: string }> = [
  { id: 'playground', label: 'playground' },
  { id: 'maker', label: 'make a recipe' },
  { id: 'gallery', label: 'the board' },
]

const TAB_CLASS = [styles.tab0, styles.tab1, styles.tab2]

/** Three washi-tape tabs hanging off the top edge. */
export function SceneNav() {
  const { scene, goTo } = useScene()
  const play = useSfx()
  const id = useId()

  const clips = useMemo(
    () =>
      TABS.map((t, i) =>
        tornEdgePolygon(120, 44, { bottom: true, left: true, right: true }, { seed: id + t.id + i, tooth: 7, depth: 4 }),
      ),
    [id],
  )

  return (
    <nav className={styles.nav} aria-label="scenes">
      {TABS.map((tab, i) => {
        const active = scene === tab.id
        return (
          <motion.button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${TAB_CLASS[i]} ${active ? styles.tabActive : ''}`}
            style={{ clipPath: clips[i], rotate: tilt(tab.id, 2.5) }}
            animate={{ y: active ? 4 : 0, scale: active ? 0.98 : 1 }}
            whileHover={{ y: active ? 4 : 6 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              play('click')
              goTo(tab.id)
            }}
          >
            {tab.label}
          </motion.button>
        )
      })}
    </nav>
  )
}
