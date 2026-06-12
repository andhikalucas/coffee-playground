import { motion } from 'motion/react'
import { useSettings } from '../../state/SettingsContext'
import { playSfx } from '../../audio/sfx'
import styles from './hud.module.css'

/** Hand-drawn bell, bottom-left. A wobbly slash falls across it when muted. */
export function MuteToggle() {
  const { muted, setMuted } = useSettings()

  return (
    <motion.button
      type="button"
      className={`${styles.muteBtn} blob-b`}
      style={{ rotate: -2 }}
      whileHover={{ scale: 1.08, rotate: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      aria-pressed={muted}
      aria-label={muted ? 'unmute sounds' : 'mute sounds'}
      title={muted ? 'unmute sounds' : 'mute sounds'}
      onClick={() => {
        const next = !muted
        setMuted(next)
        if (!next) {
          // let the un-mute be heard
          window.setTimeout(() => playSfx('pop'), 30)
        }
      }}
    >
      <svg viewBox="0 0 34 34" width="30" height="30" aria-hidden="true">
        <path
          d="M 17 4.5 Q 11 5 10.2 11 Q 9.8 16 8 19.5 Q 6.6 22 9 22.4 L 25.5 22 Q 27.6 21.6 26 19 Q 24.2 15.8 24 11.2 Q 23.6 5.2 17 4.5 Z"
          fill="var(--caramel-soft)"
          stroke="var(--ink)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M 14 25.5 Q 17 28.5 20 25.6" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 16.8 2.4 L 17.2 4.4" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
        {muted && (
          <path
            d="M 5 29.5 Q 12 22 17.5 16.5 Q 23 11 29.5 4.5"
            fill="none"
            stroke="var(--red)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.button>
  )
}
