import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TornEdge } from './TornEdge'
import styles from './handmade.module.css'

let emit: ((msg: string) => void) | null = null

/** Show a torn-paper notice from anywhere (storage errors, saves, exports). */
export function showToast(msg: string) {
  emit?.(msg)
}

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    emit = (m: string) => {
      setMsg(m)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMsg(null), 3200)
    }
    return () => {
      emit = null
      if (timer.current !== undefined) window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className={styles.toastWrap} role="status" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            initial={{ y: 40, opacity: 0, rotate: 2, x: '-50%' }}
            animate={{ y: 0, opacity: 1, rotate: -1, x: '-50%' }}
            exit={{ y: 20, opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <TornEdge edges="all" tooth={8} depth={4} shadow>
              <div className={styles.toastInner}>{msg}</div>
            </TornEdge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
