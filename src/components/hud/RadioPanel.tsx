import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RadioDoodle } from '../../art/items/RadioDoodle'
import { WobblyFrame } from '../handmade/WobblyFrame'
import { WobblyButton } from '../handmade/WobblyButton'
import { useSfx } from '../../audio/useSfx'
import styles from './hud.module.css'

type Source = 'unknown' | 'probing' | 'local' | 'youtube'

const LOCAL_SRC = '/audio/beneath-the-mask.mp3'
// official upload — "Beneath the Mask", Lyn (NexTone / P5 OST)
const YT_EMBED =
  'https://www.youtube-nocookie.com/embed/woz5qvDdMRM?autoplay=1&loop=1&playlist=woz5qvDdMRM&playsinline=1'

/**
 * The café radio, bottom-right. Plays "Beneath the Mask" — from a local file
 * if you've dropped your own copy into public/audio/, otherwise via the
 * official YouTube embed (kept visible while playing, per YT terms; collapsing
 * the radio unmounts the player and stops the music).
 */
export function RadioPanel() {
  const play = useSfx()
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState<Source>('unknown')
  const [localPlaying, setLocalPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const probe = () => {
    setSource('probing')
    const probeEl = new Audio()
    const onOk = () => setSource('local')
    // a missing public file can come back 200 with index.html — decode failure is the real signal
    const onFail = () => setSource('youtube')
    probeEl.addEventListener('canplaythrough', onOk, { once: true })
    probeEl.addEventListener('error', onFail, { once: true })
    probeEl.src = LOCAL_SRC
    probeEl.load()
  }

  const toggleOpen = () => {
    play('click')
    if (!open && source === 'unknown') probe()
    setOpen((o) => !o)
  }

  useEffect(() => {
    const el = audioRef.current
    if (el) el.volume = volume
  }, [volume, localPlaying, source, open])

  // closing the panel always silences the radio
  useEffect(() => {
    if (!open) {
      audioRef.current?.pause()
      setLocalPlaying(false)
    }
  }, [open])

  const toggleLocal = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
      setLocalPlaying(true)
    } else {
      el.pause()
      setLocalPlaying(false)
    }
  }

  return (
    <div className={styles.corner} style={{ right: 20, bottom: 20 }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="collapsed"
            type="button"
            className={`${styles.radioCollapsed} blob-a`}
            style={{ rotate: 2 }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            whileHover={{ scale: 1.08, rotate: -1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 480, damping: 20 }}
            onClick={toggleOpen}
            aria-label="open the café radio"
            title="café radio"
          >
            <RadioDoodle />
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ y: 30, scale: 0.85, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          >
            <WobblyFrame seed="radio-panel" fill="var(--paper-deep)" padding={16} className={styles.radioPanel}>
              <div className={styles.radioHeader}>
                <span className={styles.radioTitle}>café radio</span>
                <WobblyButton seed="radio-close" variant="ghost" onClick={toggleOpen} aria-label="stash the radio">
                  stash it
                </WobblyButton>
              </div>
              <div className={styles.radioSong}>♪ Beneath the Mask — Lyn (Persona 5 OST)</div>

              {source === 'probing' && <div className={styles.radioHint}>tuning…</div>}

              {source === 'local' && (
                <>
                  {/* user-supplied copy — seamless loop, our own knobs */}
                  <audio ref={audioRef} src={LOCAL_SRC} loop preload="auto" />
                  <div className={styles.radioControls}>
                    <WobblyButton seed="radio-play" variant={localPlaying ? 'ink' : 'red'} onClick={toggleLocal}>
                      {localPlaying ? '❚❚ pause' : '▶ play'}
                    </WobblyButton>
                    <input
                      className={styles.volume}
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      aria-label="music volume"
                    />
                  </div>
                  <div className={styles.radioHint}>playing your local copy on loop ♡</div>
                </>
              )}

              {source === 'youtube' && (
                <>
                  <div className={styles.radioFrame}>
                    <iframe
                      src={YT_EMBED}
                      title="Beneath the Mask — Lyn (official upload)"
                      allow="autoplay; encrypted-media"
                      referrerPolicy="strict-origin-when-cross-origin"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                    />
                  </div>
                  <div className={styles.radioHint}>
                    official upload via YouTube. drop your own mp3 at{' '}
                    <code>public/audio/beneath-the-mask.mp3</code> for a seamless loop.
                  </div>
                </>
              )}
            </WobblyFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
