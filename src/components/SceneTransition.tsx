import { motion } from 'motion/react'
import { useScene } from '../state/SceneContext'
import { useSettings } from '../state/SettingsContext'
import styles from './SceneTransition.module.css'

const EASE = [0.76, 0, 0.24, 1] as const
const BAND_SECS = 0.95

/**
 * Persona-style diagonal wipe: a red band leads, an ink band chases it,
 * and the scene swaps underneath while the viewport is covered
 * (timing lives in SceneContext's WIPE constants).
 */
export function SceneTransition() {
  const { phase, wipeId } = useScene()
  const { reducedMotion } = useSettings()

  if (phase === 'idle') return null

  if (reducedMotion) {
    return (
      <motion.div
        key={wipeId}
        className={styles.fade}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.22, times: [0, 0.35, 0.65, 1] }}
      />
    )
  }

  return (
    <div className={styles.wipeHost} key={wipeId} aria-hidden="true">
      <motion.div
        className={styles.bandRed}
        style={{ skewX: -12 }}
        initial={{ x: '-130%' }}
        animate={{ x: '130%' }}
        transition={{ duration: BAND_SECS, ease: EASE }}
      />
      <motion.div
        className={styles.bandInk}
        style={{ skewX: -12 }}
        initial={{ x: '-130%' }}
        animate={{ x: '130%' }}
        transition={{ duration: BAND_SECS, ease: EASE, delay: 0.07 }}
      />
    </div>
  )
}
